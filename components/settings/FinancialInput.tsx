import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/hooks/useCurrency';
import { sanitizeCurrencyInput } from '@/utils/sanitzeCurrencyInput';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  title: string;
  value: number;
  onSave: (value: number) => void;
  placeholder?: string;
  valueColor?: string;
}

export default function FinancialInput({ title, value, onSave, placeholder, valueColor = Colors.text }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  const { formatAmount } = useCurrency();

  // Sync prop changes to internal state
  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleSave = () => {
    const parsedValue = parseFloat(inputValue) || 0;
    onSave(parsedValue);
    
    // Small delay before switching back to display mode
    setTimeout(() => {
      setIsEditing(false);
    }, 100);
  };

  const handleCancel = () => {
    setInputValue(value.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <View style={styles.editingContainer}>
          <Text style={styles.title}>{title}</Text>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={(text) => setInputValue(sanitizeCurrencyInput(text))}
            keyboardType="decimal-pad"
            placeholder={placeholder || `${formatAmount(0)}`}
            placeholderTextColor="#888"
            autoFocus
            selectTextOnFocus
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => {
      setInputValue(''); // Set to blank when editing starts
      setIsEditing(true);
    }}>
      <View style={styles.contentRow}>
        <View style={styles.leftColumn}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.value, { color: valueColor }]}>{formatAmount(value)}</Text>
        </View>
        <Text style={styles.editHint}>Tap to edit</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark3,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 1,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  value: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  editHint: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  editingContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    borderWidth: 1,
    borderColor: Colors.tint,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.dark4,
  },
  saveButton: {
    backgroundColor: Colors.buttonGreen,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
}); 