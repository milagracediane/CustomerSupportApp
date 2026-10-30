import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const categories = [
  'Account Problem',
  'Technical Issue',
  'Payment Concern',
  'Other',
];

export default function HomeScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showMessage = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const uploadToCloudinary = async (uri: string) => {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary settings are missing.');
    }

    if (Platform.OS === 'web') {
      const imageResponse = await fetch(uri);
      const imageBlob = await imageResponse.blob();

      const formData = new FormData();
      formData.append('file', imageBlob, 'screenshot.jpg');
      formData.append('upload_preset', uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Image upload failed.');
      }

      if (!data.secure_url) {
        throw new Error('Cloudinary did not return an image URL.');
      }

      return data.secure_url as string;
    }

    const uploadResult = await FileSystem.uploadAsync(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      uri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        mimeType: 'image/jpeg',
        parameters: {
          upload_preset: uploadPreset,
        },
      }
    );

    const data = JSON.parse(uploadResult.body);

    if (uploadResult.status < 200 || uploadResult.status >= 300) {
      throw new Error(data.error?.message || 'Image upload failed.');
    }

    if (!data.secure_url) {
      throw new Error('Cloudinary did not return an image URL.');
    }

    return data.secure_url as string;
  };

  const sendSupportEmail = async (imageUrl: string) => {
    const serviceId = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.EXPO_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      throw new Error('EmailJS settings are missing.');
    }

    const response = await fetch(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: {
            name: name,
            reply_to: email,
            issue_category: category,
            message: message,
            image_url: imageUrl,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Email could not be sent.');
    }
  };

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showMessage(
          'Permission Required',
          'Please allow access to your photo library.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      showMessage('Error', 'Unable to open your photo library.');
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (
      !name.trim() ||
      !email.trim() ||
      !category ||
      !message.trim()
    ) {
      showMessage('Missing Information', 'Please complete all fields.');
      return;
    }

    if (!email.includes('@')) {
      showMessage('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!imageUri) {
      showMessage('Screenshot Required', 'Please upload a screenshot.');
      return;
    }

    try {
      setIsSubmitting(true);

      const imageUrl = await uploadToCloudinary(imageUri);

      await sendSupportEmail(imageUrl);

      showMessage(
        'Request Sent!',
        'Your support request and screenshot were successfully sent.'
      );
    } catch (error) {
      showMessage(
        'Submission Failed',
        error instanceof Error ? error.message : 'Something went wrong.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Customer Support</Text>
        <Text style={styles.subtitle}>
          Tell us how we can help you.
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Issue Category</Text>
        <Text
          style={{
            fontSize: 12,
            color: '#68738A',
            marginBottom: 10,
          }}
        >
          Select the category that best describes your concern.
        </Text>

        <View style={styles.categoryContainer}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.categoryButton,
                category === item && styles.selectedCategory,
              ]}
              onPress={() => setCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === item && styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Describe your concern..."
          multiline
          textAlignVertical="top"
          value={message}
          onChangeText={setMessage}
          maxLength={500}
        />

        <Text
          style={{
            textAlign: 'right',
            color: '#888',
            fontSize: 12,
            marginTop: 5,
          }}
        >
          {message.length}/500 characters
        </Text>

        <Text style={styles.label}>Screenshot Upload</Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={pickImage}
        >
          <Text style={styles.uploadButtonText}>
            + Upload Screenshot
          </Text>
        </TouchableOpacity>

        {imageUri && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
            />

            <View style={styles.imageActions}>
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.changeText}>Change Image</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setImageUri(null)}>
                <Text style={styles.removeText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && { opacity: 0.6 }
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.submitButtonText}>
                Submitting...
              </Text>
            </>
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Request
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FB',
  },
  content: {
    padding: 24,
    paddingTop: 50,
    paddingBottom: 40,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#25345C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#68738A',
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#303B54',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE1EB',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
  },
  messageInput: {
    height: 120,
  },
  categoryContainer: {
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE1EB',
    borderRadius: 10,
    padding: 13,
  },
  selectedCategory: {
    backgroundColor: '#E8EDFF',
    borderColor: '#536DCE',
  },
  categoryText: {
    color: '#303B54',
  },
  selectedCategoryText: {
    color: '#354FA8',
    fontWeight: '600',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#536DCE',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#4059B5',
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  changeText: {
    color: '#4059B5',
    fontWeight: '600',
  },
  removeText: {
    color: '#D14343',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4059B5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});