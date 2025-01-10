import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToast,
  CToaster,
  CToastBody,
  CToastClose
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import config from '../../config'; 

const Register = () => {
  const [toasts, setToasts] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${config.API_BASE_URL}/${config.REGISTER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        addToast('success', 'Successfully registered')
      } else {
        console.error('Register failed:', data);
        addToast('danger', 'Error registering, please contact admin')
      }
    } catch (error) {
      console.error('Error during register:', error);
      addToast('danger', 'Error registering, please contact admin')
    }
  };

  const addToast = (color, message) => {
    const newToast = { id: Date.now(), color, message };
    setToasts([...toasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm
                  noValidate
                  onSubmit={handleRegister}
                >
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput 
                      placeholder="Email" 
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success">Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CToaster
          placement="top-end"
          style={{
            marginTop: '20px',
            marginRight: '20px',
          }}
        >
          {toasts.map((toast) => (
            <CToast key={toast.id} autohide={true} visible={true} color={toast.color}>
              <CToastBody>
                {toast.message}
                <CToastClose onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
              </CToastBody>
            </CToast>
          ))}
        </CToaster>
      </CContainer>
    </div>
  )
}

export default Register
