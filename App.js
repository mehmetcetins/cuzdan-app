
import React from 'react';
import store from './redux/store';
import { Provider  as ReduxProvider} from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import AppContainer from "./routes";
export default function App() {
  
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <AppContainer/>
      </PaperProvider>
    </ReduxProvider>
  );
}

