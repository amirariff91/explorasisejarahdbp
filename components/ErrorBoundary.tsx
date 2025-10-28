import React from 'react';
import { View, Text, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { Typography, Colors } from '@/constants/theme';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * ErrorBoundary Component
 * Catches and handles React errors gracefully
 * Provides user-friendly error screen with recovery option
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error);
    console.error('Error Info:', errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to analytics/logging service when implemented
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ImageBackground
          source={require('@/assets/images/game/backgrounds/bg-main.png')}
          style={styles.container}>
          <View style={styles.errorCard}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.title}>Oops! Sesuatu Tidak Kena</Text>
            <Text style={styles.message}>
              Maaf, permainan mengalami masalah teknikal.
            </Text>

            {/* Show error details in development mode */}
            {__DEV__ && this.state.error && (
              <View style={styles.errorDetailsContainer}>
                <Text style={styles.errorDetails}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.errorStack}>
                    {this.state.errorInfo.componentStack?.substring(0, 200)}...
                  </Text>
                )}
              </View>
            )}

            <Pressable style={styles.button} onPress={this.handleReset}>
              <Text style={styles.buttonText}>Cuba Lagi</Text>
            </Pressable>

            <Text style={styles.hint}>
              Jika masalah berterusan, sila tutup dan buka semula aplikasi.
            </Text>
          </View>
        </ImageBackground>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontFamily: Typography.fontFamily,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  errorDetailsContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    maxWidth: '100%',
    width: '100%',
  },
  errorDetails: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#d32f2f',
    marginBottom: 8,
  },
  errorStack: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#666',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  hint: {
    fontFamily: Typography.fontFamily,
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
