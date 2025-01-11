/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
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
} from '@coreui/react';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

const MakeRequest = () => {
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
  const [currDate, setCurrDate] = useState('');
  const [curr_user_id, setCurrUserId] = useState('');
  const [receiverId, setReceiverId] = useState('');

  const get_receiver_id = async (company_name) => {
    const response = await fetch(
      `${config.API_BASE_URL}/${config.GET_ALL_ACCOUNTS}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    for (const key in data) {
      if (data[key]['name'] === company_name) {
        return data[key]['id'];
      }
    }
  };

  const get_requestor_id = async () => {
    const response = await fetch(
      `${config.API_BASE_URL}/${config.ACCOUNT_ENDPOINT}`
    );
    const result = await response.json();
    const requestor_comp_name = result['name'];
    return get_receiver_id(requestor_comp_name);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);
    if (!form.checkValidity()) return;

    setLoading(true);
    formData.requestorId = await get_requestor_id();
    formData.receiverId = await get_receiver_id(formData.company);

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/${config.NEW_TRADE_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

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
        <CCardHeader>Make a Token Request</CCardHeader>
        <CCallout>Note that every credit costs $10</CCallout>

        <CCardBody>
          <CForm noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="mb-3">
              <CFormLabel htmlFor="company">Company</CFormLabel>
              <CFormSelect
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              >
                <option value="">Select a company</option>
                {config.COMPANIES.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </CFormSelect>
              <CFormFeedback invalid>Please select a company.</CFormFeedback>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="action">Action</CFormLabel>
              <CFormSelect
                id="action"
                name="action"
                value={formData.action}
                onChange={handleChange}
                required
              >
                <option value="">Select an action</option>
                <option value="buy">BUY</option>
                <option value="sell">SELL</option>
              </CFormSelect>
              <CFormFeedback invalid>Please select an action.</CFormFeedback>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="quantity">Quantity</CFormLabel>
              <CFormInput
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter the quantity"
                required
              />
              <CFormFeedback invalid>Please provide a valid quantity.</CFormFeedback>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="reqreason">Request Reason</CFormLabel>
              <CFormInput
                type="text"
                id="reqreason"
                name="reqreason"
                value={formData.reqreason}
                onChange={handleChange}
                placeholder="Enter the request reason"
                required
              />
              <CFormFeedback invalid>Please provide a valid reason. Must be text.</CFormFeedback>
            </div>
            <CButton type="submit" color="primary" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Submit'}
            </CButton>
          </CForm>
        </CCardBody>
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

export default MakeRequest;
