import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/hooks/useCurrency';
import { VariableExpenseCategory } from '@/types/settings';
import { sanitizeCurrencyInput } from '@/utils/sanitzeCurrencyInput';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
  category: VariableExpenseCategory;
  onUpdate: (id: string, updates: Partial<VariableExpenseCategory>) => void;
  onDelete: (id: string) => void;
}

export default function VECategoryItem({ category, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [editLimit, setEditLimit] = useState(category.defaultLimit.toString());
  const { formatAmount } = useCurrency();

  const handleSave = () => {
    const parsedLimit = parseFloat(editLimit) || 0;
    
    // Validation
    if (!editName.trim()) {
      Alert.alert('Invalid Input', 'Please enter a category name');
      return;
    }
    if (parsedLimit <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return;
    }
    
    // Show confirmation
    Alert.alert(
      'Update Category',
      'This will update the category for future months. Your current month\'s budget will remain unchanged.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            onUpdate(category.id, {
              name: editName.trim(),
              defaultLimit: parsedLimit,
            });
            setIsEditing(false);
          }
        },
      ]
    );
  };

  const handleCancel = () => {
    setEditName(category.name);
    setEditLimit(category.defaultLimit.toString());
    setIsEditing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? This will be automatically applied to future months but this month's budget will remain as it is.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', style: 'destructive', onPress: () => onDelete(category.id) },
      ]
    );
  };

  if (isEditing) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 120}
        style={[styles.container, { marginBottom: 200 }]}
      >
        <View style={styles.editingContainer}>
          <TextInput
            style={styles.nameInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Category name"
            placeholderTextColor="#888"
            autoFocus
          />
          <TextInput
            style={styles.limitInput}
            value={editLimit}
            onChangeText={(text) => setEditLimit(sanitizeCurrencyInput(text))}
            keyboardType="decimal-pad"
            placeholder={formatAmount(0)}
            placeholderTextColor="#888"
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
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <View style={styles.leftContent}>
          <Text style={styles.name}>
            {category.name}
          </Text>
          <Text style={styles.limit}>
            {formatAmount(category.defaultLimit)} monthly
          </Text>
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setIsEditing(true)}
          >
            <Icon name="edit" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleDelete}
          >
            <Icon name="delete" size={20} color={Colors.colorCritical} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark3,
    borderRadius: 12,
    marginBottom: 8,
    padding: 16,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  limit: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  rightContent: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
  editingContainer: {
    gap: 12,
  },
  nameInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.tint,
  },
  limitInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
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