/* eslint-disable no-unused-expressions */
import React, { useRef, useCallback } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather'
import ImagePicker from 'react-native-image-picker'

import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';


import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar
} from './styles';


interface SignUpFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const SignUp: React.FC = () => {
  const {user, updateUser} = useAuth()
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .required("Email Obrigatório")
            .email("Digite um email valido"),
          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            is: (val) => !!val.length,
            then: Yup.string().min(6, "No mínimo 6 dígitos"),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref("password"), undefined],
            "Confirmação incorreta"
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const formData = {
          name: data.name,
          email: data.email,
          ...(data.old_password
            ? {
                old_password: data.old_password,
                password: data.password,
                password_confirmation: data.password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        navigation.goBack();

        Alert.alert('Perfil atualizado com sucesso!');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          formRef.current?.setErrors(getValidationErrors(error));
          return;
        }

        Alert.alert('Erro ao atualizar cadastro', 'Tente novamente');
      }
    },
    [navigation],
  );

  const handleGoBack = useCallback(()=>{
    navigation.goBack();
  },[])

  const handleAvatarUpdate = useCallback(()=>{
    ImagePicker.showImagePicker({
      title: 'Selecione um avatar',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Usar camera',
      chooseFromLibraryButtonTitle: 'Escolhe da galeria'
    }, response => {
      if(response.didCancel) {
        return
      }

      if(response.error){
        console.log(response.error)
        Alert.alert('Erro ao atualizar seu avatar')
        return;
      }

      const data = new FormData();

      data.append('avatar', {
        uri: response.uri,
        type: 'image/jpg',
        name: `${user.id}.jpg`
      })

      api.patch('users/avatar', data).then(response => {
        updateUser(response.data)
      })
    })
  },[updateUser, user.id])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591"/>
            </BackButton>
            <UserAvatarButton onPress={handleAvatarUpdate}>
              <UserAvatar source={{uri: user.avatar_url}}/>
            </UserAvatarButton>
            <View>
              <Title>Meu Perfil</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSubmit} initialData={{
              name: user.name,
              email: user.email
            }}>
              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                secureTextEntry
                textContentType="newPassword"
                name="old_password"
                icon="lock"
                placeholder="Senha atual"
                returnKeyType="next"
                containerStyle={{marginTop: 16}}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                textContentType="newPassword"
                name="password"
                icon="lock"
                placeholder="Nova senha"
                returnKeyType="next"
                onSubmitEditing={() => passwordConfirmationInputRef.current?.focus()}
              />
              <Input
                ref={passwordConfirmationInputRef}
                secureTextEntry
                textContentType="newPassword"
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar senha"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />

              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

    </>
  );
};

export default SignUp;
