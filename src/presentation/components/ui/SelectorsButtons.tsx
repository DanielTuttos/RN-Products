import {Button, ButtonGroup, useTheme} from '@ui-kitten/components';
import { Gender, Size } from '../../../domain/entities/product';

interface Props {
  values: Gender[] | Size[];
  currentValues: any;
  onPress: (value: any) => void;
  isSelectOne?: boolean;
}

export const SelectorsButtons = ({
  values,
  onPress,
  isSelectOne = false,
  currentValues,
}: Props) => {
  const theme = useTheme();
  const themeOnlyOne = (value: any) => {
    if (isSelectOne) {
      return currentValues.startsWith(value)
        ? theme['color-primary-200']
        : undefined;
    }
    return currentValues.includes(value)
      ? theme['color-primary-200']
      : undefined;
  };
  return (
    <ButtonGroup
      size="small"
      appearance="outline"
      style={{
        margin: 2,
        marginTop: 20,
        marginHorizontal: 15,
      }}>
      {values.map(value => (
        <Button
          onPress={() => onPress(value)}
          key={value}
          style={{
            flex: 1,
            backgroundColor: themeOnlyOne(value),
          }}>
          {value}
        </Button>
      ))}
    </ButtonGroup>
  );
};
