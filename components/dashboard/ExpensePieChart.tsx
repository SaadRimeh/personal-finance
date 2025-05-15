import React from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { useTranslation } from '@/hooks/useTranslation';
import { COLORS } from '@/constants/colors';
import { CategoryTotal } from '@/types';

interface ExpensePieChartProps {
  data: CategoryTotal[];
}

export default function ExpensePieChart({ data }: ExpensePieChartProps) {
  const { t, isRTL } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // If no expenses yet, show placeholder
  if (data.length === 0) {
    return (
      <View style={[
        styles.emptyContainer,
        { backgroundColor: isDark ? COLORS.darkCard : COLORS.lightCard }
      ]}>
        <Text style={[
          styles.emptyText,
          { color: isDark ? COLORS.lightText : COLORS.darkText }
        ]}>
          {t('noTransactionsYet')}
        </Text>
      </View>
    );
  }
  
  const width = Dimensions.get('window').width - 64;
  const height = 220;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 30;
  
  // Create pie chart paths
  let startAngle = 0;
  const paths = data.map((item, index) => {
    const percentage = item.percentage / 100;
    const angle = percentage * 2 * Math.PI;
    const endAngle = startAngle + angle;
    
    const x1 = centerX + radius * Math.sin(startAngle);
    const y1 = centerY - radius * Math.cos(startAngle);
    const x2 = centerX + radius * Math.sin(endAngle);
    const y2 = centerY - radius * Math.cos(endAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const pathData = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    
    // For label positioning
    const labelAngle = startAngle + angle / 2;
    const labelRadius = radius * 0.7;
    const labelX = centerX + labelRadius * Math.sin(labelAngle);
    const labelY = centerY - labelRadius * Math.cos(labelAngle);
    
    const path = {
      path: pathData,
      color: item.color,
      percentage: item.percentage,
      labelX,
      labelY,
    };
    
    startAngle = endAngle;
    return path;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={width} height={height}>
          <G>
            {paths.map((path, index) => (
              <React.Fragment key={index}>
                <Path
                  d={path.path}
                  fill={path.color}
                  stroke="white"
                  strokeWidth={1}
                />
                {path.percentage >= 10 && (
                  <SvgText
                    x={path.labelX}
                    y={path.labelY}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {`${path.percentage}%`}
                  </SvgText>
                )}
              </React.Fragment>
            ))}
          </G>
        </Svg>
      </View>
      
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[
              styles.legendText,
              { color: isDark ? COLORS.lightText : COLORS.darkText }
            ]}>
              {t(item.name)} ({item.percentage}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  emptyContainer: {
    height: 180,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});