import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

const FirebaseTest = () => {
  const [status, setStatus] = useState('Testing Firebase connection...');
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        // Test writing to Firestore
        const testDoc = await addDoc(collection(db, 'test'), {
          message: 'Hello from Plateful!',
          timestamp: new Date(),
          test: true
        });
        
        setStatus('✅ Firebase connection successful!');
        setTestData({ id: testDoc.id, message: 'Hello from Plateful!' });
        
        // Test reading from Firestore
        const querySnapshot = await getDocs(collection(db, 'test'));
        console.log('Firebase test documents:', querySnapshot.docs.map(doc => doc.data()));
        
      } catch (error) {
        setStatus(`❌ Firebase error: ${error.message}`);
        console.error('Firebase test error:', error);
      }
    };

    testFirebase();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px 0', borderRadius: '8px' }}>
      <h3>Firebase Connection Test</h3>
      <p><strong>Status:</strong> {status}</p>
      {testData && (
        <div>
          <p><strong>Test Document ID:</strong> {testData.id}</p>
          <p><strong>Message:</strong> {testData.message}</p>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;
