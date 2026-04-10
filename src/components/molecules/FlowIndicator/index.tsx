import React, { Text, View } from 'react-native';
import { createStyles } from './styles';

interface FlowIndicatorProps {
  totalSteps: number;
  currentStep: number;
  barStep?: number;
}

const FlowIndicator = ({ totalSteps, currentStep, barStep }: FlowIndicatorProps) => {
  const indicators = [];
  const styles = createStyles({});

  for (let i = 1; i <= totalSteps; i++) {
    indicators.push(
      <View key={i} style={styles.segmentBase}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: i <= currentStep ? '#4A80F0' : 'transparent',
              width: i === currentStep ? '50%' : '100%',
            },
          ]}
        />
      </View>,
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>{indicators}</View>
      <Text style={styles.stepText}>{`${currentStep}/${totalSteps}`}</Text>
    </View>
  );
};

export default FlowIndicator;
