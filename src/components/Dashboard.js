import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, get } from 'firebase/database';
import { Container, Box, Typography, Button, List, ListItem, ListItemText, Paper } from '@mui/material';

const Dashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [loginHistory, setLoginHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    const fetchLoginHistory = async () => {
      try {
        const historyRef = ref(database, `users/${currentUser.uid}/logins`);
        const snapshot = await get(historyRef);
        if (snapshot.exists()) {
          const historyData = snapshot.val();
          const historyArray = Object.entries(historyData).map(([key, value]) => ({
            id: key,
            ...value
          }));
          setLoginHistory(historyArray.sort((a, b) => b.timestamp.localeCompare(a.timestamp)));
        }
      } catch (error) {
        console.error('Giriş geçmişi alınamadı:', error);
      }
    };

    fetchLoginHistory();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hoş Geldiniz, {currentUser?.email}
        </Typography>
        
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mb: 4 }}
        >
          Çıkış Yap
        </Button>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Giriş/Çıkış Geçmişi
          </Typography>
          <List>
            {loginHistory.map((entry) => (
              <ListItem key={entry.id}>
                <ListItemText
                  primary={entry.type === 'login' ? 'Giriş Yapıldı' : 'Çıkış Yapıldı'}
                  secondary={new Date(entry.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 