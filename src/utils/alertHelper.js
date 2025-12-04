import { Alert, Platform } from 'react-native';

/**
 * Alert compatible Web et Mobile
 * Sur web, utilise window.confirm
 * Sur mobile, utilise Alert.alert natif
 */
export const showAlert = (title, message, buttons = []) => {
  if (Platform.OS === 'web') {
    // Version Web avec window.confirm
    const confirmMessage = `${title}\n\n${message}`;
    
    if (buttons.length === 0) {
      // Simple alerte
      window.alert(confirmMessage);
      return;
    }

    // Trouver le bouton destructif/confirm
    const confirmButton = buttons.find(b => b.style === 'destructive' || b.onPress);
    const cancelButton = buttons.find(b => b.style === 'cancel');

    const confirmed = window.confirm(confirmMessage);
    
    if (confirmed && confirmButton?.onPress) {
      confirmButton.onPress();
    } else if (!confirmed && cancelButton?.onPress) {
      cancelButton.onPress();
    }
  } else {
    // Version Mobile native
    Alert.alert(title, message, buttons);
  }
};

/**
 * Alert simple (juste OK)
 */
export const showSimpleAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

/**
 * Confirmation (OK/Annuler)
 */
export const showConfirm = (title, message, onConfirm, onCancel) => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm(`${title}\n\n${message}`);
    if (confirmed && onConfirm) {
      onConfirm();
    } else if (!confirmed && onCancel) {
      onCancel();
    }
  } else {
    Alert.alert(
      title,
      message,
      [
        { text: 'Annuler', style: 'cancel', onPress: onCancel },
        { text: 'OK', onPress: onConfirm },
      ]
    );
  }
};

/**
 * Choix multiple (comme pour le seuil d'alerte)
 */
export const showActionSheet = (title, message, options) => {
  if (Platform.OS === 'web') {
    // Sur web, créer une liste numérotée
    const optionsList = options
      .filter(opt => opt.style !== 'cancel')
      .map((opt, index) => `${index + 1}. ${opt.text}`)
      .join('\n');
    
    const fullMessage = `${title}\n\n${message}\n\n${optionsList}\n\nEntrez le numéro de votre choix (ou Annuler) :`;
    
    const choice = window.prompt(fullMessage);
    
    if (choice && !isNaN(choice)) {
      const index = parseInt(choice) - 1;
      const selectedOption = options.filter(opt => opt.style !== 'cancel')[index];
      if (selectedOption?.onPress) {
        selectedOption.onPress();
      }
    }
  } else {
    Alert.alert(title, message, options);
  }
};

export default {
  showAlert,
  showSimpleAlert,
  showConfirm,
  showActionSheet,
};