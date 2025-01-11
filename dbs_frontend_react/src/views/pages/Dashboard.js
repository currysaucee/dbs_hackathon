import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
  CRow,
  CCol,
  CModal, 
  CModalBody, 
  CModalFooter, 
  CModalHeader, 
  CModalTitle,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormFeedback,
  CFormInput
} from '@coreui/react';
import { io } from 'socket.io-client'; 
import config from '../../config';

const Table = () => {
  console.log("Table page is loaded");
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [newRowId, setNewRowId] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDetails, setEditDetails] = useState([]);
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amountChanged, setAmountChanged] = useState();
  const [sortColumn, setSortColumn] = useState('timestamp');
  const [accountBalance, setAccountBalance] = useState(config.MOCK_ACCOUNT_BALANCE);
  const [accountName, setAccountName] = useState(config.MOCK_ACCOUNT_NAME);
  const [carbonCredit, setCarbonCredit] = useState(config.MOCK_CARBON_CREDIT);
  const [sortDirection, setSortDirection] = useState('desc');
  const company_id = localStorage.getItem('company_id');

  const addToast = (color, message) => {
    const newToast = { id: Date.now(), color, message };
    setToasts([...toasts, newToast]);

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  const onEditClick = (row) => {
    console.log(row)
    setEditDetails(row)
    setAmountChanged(row.price)
    setShowEditModal(true);
  }

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/${config.ACCOUNT_ENDPOINT}`);
        const result = await response.json();

        if (result && result.length > 0) {
          setAccountBalance(result.cashBalance)
          setCarbonCredit(result.carbonBalance)
          setAccountName(result.name)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCompanyDetails();
  })

  useEffect(() => {
    const fetchMockData = async() => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/${config.MOCK_DATA_ENDPOINT}`)
        const result = await response.json();

        if (result && result.length > 0) {
          setColumns(Object.keys(result[0]));
          
          const sortedData = result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setData(sortedData); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    const fetchData = async () => { 
      try {
        const response = await fetch(`${config.API_BASE_URL}/${config.GET_ORDERS_BY_ACCOUNT_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: company_id,
          }),        
        });
        const result = await response.json();

        if (result && result.length > 0) {
          setColumns(Object.keys(result[0]));
          
          const sortedData = result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setData(sortedData); 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        fetchMockData();
      }
    };

    fetchData();

    const socket = io(config.SOCKET_BASE_URL);
    socket.on('new_trade', (newTrade) => {
      console.log('New trade received:', newTrade);
      setNewRowId(newTrade.uuid || newTrade.id); 
      setData((prevData) => {
        const updatedData = [newTrade, ...prevData];
        return updatedData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleCancel = async (e) => {
    e.preventDefault();
    console.log("trying to handle cancel")
    try {
      console.log('sup man')
      const response = await fetch(`${config.API_BASE_URL}/${config.DELETE_ORDER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: order_id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        addToast('success', `${result.message}}`);
      } 
    } catch (error) {
      console.log('got error')
      addToast('danger', `Error: Have a hard error, please contact admin`);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("trying to handle submit")
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      console.log("not validate")
      e.preventDefault();
      e.stopPropagation();
    }

    setValidated(true);

    if (!form.checkValidity()) return;

    setLoading(true);

    try {
      console.log('sup man')
      const response = await fetch(`${config.API_BASE_URL}/${config.AMEND_ORDER_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: order_id,
          amount: amount
        }),
      });

      const result = await response.json();
      if (response.ok) {
        addToast('success', `${result.message}}`);
      } else {
        addToast('danger', `${result.message}}`);
      }
    } catch (error) {
      console.log('got error')
      addToast('danger', `Error: Have a hard error, please contact admin`);
    } finally {
      setLoading(false);
    }
  }

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }

    const sortedData = [...data].sort((a, b) => {
      if (column === 'timestamp') {
        // Special handling for timestamp
        return sortDirection === 'asc'
          ? new Date(a.timestamp) - new Date(b.timestamp)
          : new Date(b.timestamp) - new Date(a.timestamp);
      }

      if (a[column] < b[column]) return sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    setData(sortedData);
  };

  return (
    <>
      <CModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm
            noValidate
            validated={validated}
          >
            <div className="mb-3">
              <CFormLabel htmlFor="company">Company</CFormLabel>
              <CFormSelect
                id="company"
                name="company"
                value={editDetails.company}
                required
                disabled
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
                value={editDetails.action}
                required
                disabled
              >
                <option value="">Select an action</option>
                <option value="buy">BUY</option>
                <option value="sell">SELL</option>
              </CFormSelect>
              <CFormFeedback invalid>Please select an action.</CFormFeedback>
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="amount">Amount</CFormLabel>
              <CFormInput
                type="number"
                id="amount"
                name="amount"
                value={amountChanged}
                onChange={(e) => setAmountChanged(e.target.value)}
                placeholder="Enter the amount"
                required
              />
              <CFormFeedback invalid>Please provide a valid amount.</CFormFeedback>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </CButton>
          <CButton onClick={handleSubmit} type="submit" color="primary" disabled={loading}>
              {loading ? <CSpinner size="sm" /> : 'Submit'}
            </CButton>
        </CModalFooter>
      </CModal>
      <CContainer>
        <CCard>
          <CCardBody>
            <CRow>
              <h3>Company: {accountName}</h3>
            </CRow>
            <CRow>
              <CCol>
                <h3>Cash Balance: {accountBalance}</h3>
              </CCol>
              <CCol>
                <h3>Carbon Credit: {carbonCredit}</h3>
              </CCol>
            </CRow>

            <CTable striped hover>
              <CTableHead>
                <CTableRow>
                  {columns.map((col, index) => (
                    <CTableHeaderCell key={index}>
                      {col}
                      <CButton
                        size="sm"
                        color="link"
                        onClick={() => handleSort(col)}
                        style={{ textDecoration: 'none' }}
                      >
                        {sortColumn === col ? (sortDirection === 'asc' ? '↑' : '↓') : '↕'}
                      </CButton>
                    </CTableHeaderCell>
                  ))}
                  <CTableHeaderCell>
                    Action
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.map((row, rowIndex) => (
                  <CTableRow
                    key={rowIndex}
                    className={newRowId === row.uuid || newRowId === row.id ? 'highlight-row' : ''}
                  >
                    {columns.map((col, colIndex) => (
                      <CTableDataCell key={colIndex}>{row[col]}</CTableDataCell>
                    ))}
                    <CTableDataCell>
                      <CButton
                        size="sm"
                        color="warning"
                        onClick={() => onEditClick(row)}
                      >
                        EDIT
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        onClick={() => handleCancel(row.id)}
                      >
                        CANCEL
                      </CButton>
                      
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
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
                <CToastClose onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
              </CToastBody>
            </CToast>
          ))}
        </CToaster>
      </CContainer></>
  );
};

export default Table;
