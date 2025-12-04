import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export default function LoadingSpinner({
  size = 'large',
  color = '#00E400',
  text = 'Chargement...',
  showText = true,
  fullScreen = false,
}) {
  const Container = fullScreen ? View : React.Fragment;
  const containerStyle = fullScreen ? styles.fullScreenContainer : null;

  return (
    <Container style={containerStyle}>
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
        {showText && <Text style={styles.text}>{text}</Text>}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 12,
  },
});