import Styled from 'styled-components/native';

export const Container = Styled.View`

  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px 150px;

`;
export const Title = Styled.Text`

  font-size: 24px;
  color: #e4ede8;
  font-family: 'RobotoSlab-Medium';
  margin: 64px 0 24px;

`;

export const ForgotPassword = Styled.TouchableOpacity`

  margin-top: 24px;

`;
export const ForgotPasswordText = Styled.Text`

  color: #f4ede8;
  font-size: 16px;
  font-family: 'RobotoSlab-Regular'

`;

export const BackToSignInButton = Styled.TouchableOpacity`

  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background: #312e38;
  border-top-width: 1px;
  border-color: #232129;
  padding: 16px 0;

  justify-content: center;
  align-items: center;
  flex-direction: row;

`;

export const BackToSignInButtonText = Styled.Text`

  margin-left: 16px;
  color: #fff;
  font-size: 18px;
  font-family: 'RobotoSlab-Regular'

`;
