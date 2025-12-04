import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Rechercher une ville...',
  autoFocus = false,
  editable = true,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.searchIcon}>
        <Ionicons name="search" size={20} color="#8E8E93" />
      </View>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8E8E93"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="words"
        autoCorrect={false}
        editable={editable}
      />

      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Ionicons name="close-circle" size={20} color="#8E8E93" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
});