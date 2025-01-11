/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { CFormCheck } from '@coreui/react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CSpinner,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
  CContainer,
  CFormFeedback,
  CCardText,
  CCallout,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import config from '../../config'; 
import { useNavigate } from 'react-router-dom';
import Buttons from '../template_examples/buttons/buttons/Buttons';

const OrderRequests = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    action: '',
    quantity: '',
    reqreason: '',
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [validated, setValidated] = useState(false);
  const [currDate, setCurrDate] = useState('')
  const [columns, setColumns] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("trying to handle submit")
    const form = e.currentTarget;
    console.log(form)
    if (form.checkValidity() === false) {
      console.log("not validate")
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    if (!form.checkValidity()) return;

    setLoading(true);

    try {
      const response = await fetch(`${config.API_BASE_URL}/${config.NEW_TRADE_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        addToast('success', 'Trade successfully made!');
      } else {
        addToast('danger', `Failed to make trade: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      addToast('danger', `Error: ${error.message}`);
    } finally {
      setLoading(false);
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
    <CContainer>
      <CCard className="mb-4">
        <CCardHeader>Your outstanding requests from other companies</CCardHeader>
        <CCallout>Note that every credit costs $10</CCallout>
        <CButton color="success" variant="outline">Accept</CButton>
        <CButton color="danger" variant="outline">Reject</CButton>
        <>
        </>
      </CCard>

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
              <CToastClose
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              />
            </CToastBody>
          </CToast>
        ))}
      </CToaster>
    </CContainer>
  );
};

export default OrderRequests;
