import { CalculatorProvider } from './context/CalculatorContext';
import Calculator from './components/Calculator';

export default function Home() {
  return (
    <CalculatorProvider>
      <Calculator />
    </CalculatorProvider>
  );
}
