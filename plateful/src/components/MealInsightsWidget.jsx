import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Grid,
  Paper
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { getWeekStartDate, getWeekDates, countMealsByStatus, MEAL_TYPES, DAYS_OF_WEEK } from '../utils/mealPlanSchema';
import { useMealPlan } from '../context/MealPlanContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const MealInsightsWidget = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStartDate());
  const [weeksData, setWeeksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadMealPlan, currentMealPlan } = useMealPlan();

  // Calculate the 4 weeks to display
  const getFourWeeks = (startWeek) => {
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(startWeek);
      weekStart.setDate(startWeek.getDate() + (i * 7));
      weeks.push(weekStart);
    }
    return weeks;
  };

  // Process meal plan data for a specific week
  const processWeekData = (mealPlan, weekStart, weekIndex) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    if (!mealPlan || !mealPlan.meals) {
      return {
        weekStart,
        weekEnd,
        weekLabel: `Week ${weekIndex + 1}`,
        homeCooked: 0,
        eatenOut: 0,
        skipped: 0,
        total: 0,
        hasData: false
      };
    }

    let homeCooked = 0;
    let eatenOut = 0;
    let skipped = 0;

    // Count meals for each day of the week
    DAYS_OF_WEEK.forEach(day => {
      MEAL_TYPES.forEach(mealType => {
        const meal = mealPlan.meals[day]?.[mealType];
        if (meal) {
          if (meal.recipe) {
            // Has a recipe = home-cooked meal
            homeCooked++;
          } else if (meal.status === 'eaten_out') {
            eatenOut++;
          } else if (meal.status === 'skip') {
            skipped++;
          }
        }
      });
    });

    return {
      weekStart,
      weekEnd,
      weekLabel: `Week ${weekIndex + 1}`,
      homeCooked,
      eatenOut,
      skipped,
      total: homeCooked + eatenOut + skipped,
      hasData: homeCooked > 0 || eatenOut > 0 || skipped > 0
    };
  };

  useEffect(() => {
    const fetchWeeksData = async () => {
      setLoading(true);
      const weeks = getFourWeeks(currentWeekStart);
      const data = [];

      for (let i = 0; i < weeks.length; i++) {
        const weekStart = weeks[i];
        try {
          // Query Firebase directly for this week's meal plan
          const weekStartString = weekStart.toISOString().split('T')[0]; // YYYY-MM-DD format
          const mealPlansQuery = query(
            collection(db, 'mealPlans'),
            where('weekStartDate', '==', weekStartString)
          );
          
          const querySnapshot = await getDocs(mealPlansQuery);
          let mealPlan = null;
          
          if (!querySnapshot.empty) {
            const mealPlanDoc = querySnapshot.docs[0];
            mealPlan = { id: mealPlanDoc.id, ...mealPlanDoc.data() };
          }
          
          const weekData = processWeekData(mealPlan, weekStart, i);
          data.push(weekData);
        } catch (error) {
          console.error(`Error loading meal plan for week ${i + 1}:`, error);
          // Add empty week data if loading fails
          const weekData = processWeekData(null, weekStart, i);
          data.push(weekData);
        }
      }

      setWeeksData(data);
      setLoading(false);
    };

    fetchWeeksData();
  }, [currentWeekStart]);

  const handlePreviousMonth = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(currentWeekStart.getDate() - 28); // Go back 4 weeks
    setCurrentWeekStart(newWeek);
  };

  const handleNextMonth = () => {
    const newWeek = new Date(currentWeekStart);
    newWeek.setDate(currentWeekStart.getDate() + 28); // Go forward 4 weeks
    setCurrentWeekStart(newWeek);
  };

  const formatWeekRange = (weekStart, weekEnd) => {
    const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const getMaxValue = () => {
    return Math.max(...weeksData.map(week => week.total), 20);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading insights...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {/* Header with navigation */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Meal Patterns (4 Weeks)
          </Typography>
          <Box>
            <IconButton onClick={handlePreviousMonth} size="small">
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextMonth} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        {/* Chart */}
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={1}>
            {weeksData.map((week, index) => {
              const maxValue = getMaxValue();
              const homeCookedHeight = (week.homeCooked / maxValue) * 200;
              const eatenOutHeight = (week.eatenOut / maxValue) * 200;
              
              return (
                <Grid item xs={3} sm={3} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    {/* Week label */}
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                      {week.weekLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                      {formatWeekRange(week.weekStart, week.weekEnd)}
                    </Typography>
                    
                    {/* Bar chart */}
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      height: 220,
                      justifyContent: 'flex-end'
                    }}>
                      {/* Stacked bars */}
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: { xs: 30, sm: 40 },
                        height: 200,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        overflow: 'hidden',
                        mx: 'auto',
                        justifyContent: 'flex-end',
                        backgroundColor: week.hasData ? 'transparent' : '#f5f5f5'
                      }}>
                        {!week.hasData ? (
                          // No data message
                          <Box sx={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            p: 1
                          }}>
                            <Typography variant="caption" sx={{ 
                              color: 'text.secondary', 
                              fontSize: { xs: '0.5rem', sm: '0.6rem' },
                              textAlign: 'center',
                              lineHeight: 1.2
                            }}>
                              No data
                            </Typography>
                          </Box>
                        ) : (
                          <>
                            {/* Home cooked (bottom) */}
                            {week.homeCooked > 0 && (
                              <Box sx={{
                                width: '100%',
                                height: `${homeCookedHeight}px`,
                                backgroundColor: '#4caf50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                                  {week.homeCooked}
                                </Typography>
                              </Box>
                            )}
                            
                            {/* Eaten out (top) */}
                            {week.eatenOut > 0 && (
                              <Box sx={{
                                width: '100%',
                                height: `${eatenOutHeight}px`,
                                backgroundColor: '#ff9800',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '0.6rem', sm: '0.75rem' } }}>
                                  {week.eatenOut}
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: { xs: 12, sm: 16 }, height: { xs: 12, sm: 16 }, backgroundColor: '#4caf50', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Home Cooked</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: { xs: 12, sm: 16 }, height: { xs: 12, sm: 16 }, backgroundColor: '#ff9800', borderRadius: 1 }} />
            <Typography variant="caption" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>Eaten Out</Typography>
          </Box>
        </Box>

        {/* Summary stats */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Summary (4 weeks)
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="h6" color="success.main">
                {weeksData.reduce((sum, week) => sum + week.homeCooked, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Home Cooked
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" color="warning.main">
                {weeksData.reduce((sum, week) => sum + week.eatenOut, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Eaten Out
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6">
                {weeksData.reduce((sum, week) => sum + week.total, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Meals
              </Typography>
            </Grid>
          </Grid>
          {weeksData.filter(week => week.hasData).length === 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
              No meal data available for this period
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MealInsightsWidget;
