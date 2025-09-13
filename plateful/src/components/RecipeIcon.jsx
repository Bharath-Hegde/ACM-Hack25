import { Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material';

const RecipeIcon = ({ recipe }) => {

    return (
        <Card
            sx={{
                height: '100px',
                width: '100px',
                position: 'relative',
            }}
        >
            <CardMedia
                component="img"
                height="100%"
                image={recipe.imageUrl}
                alt={recipe.name}
                sx={{ objectFit: 'cover' }}
            />

                <Typography variant="subtitle2" component="h2" position="absolute" top="0" pt="5px" px="5px" maxWidth="90px" margin="auto" color="white" bgcolor="rgba(0, 0, 0, 0.4)">
                    {recipe.name}
                </Typography>
        </Card>
    );
};

export default RecipeIcon;
