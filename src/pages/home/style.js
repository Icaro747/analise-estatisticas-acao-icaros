import styled from 'styled-components';

export const FormCartier = styled.form`
  width: 100%;
  margin: 30px auto;
  padding: 30px;
  border-radius: 10px;
  background: whitesmoke;
  color: black;
`;

export const BoxItensFrom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 35px;
  color: black;
  
  .p-float-label{
    width: 100%;
    padding: 0 10px;
    .p-inputnumber{
      width: 100%;
    }
    .p-dropdown{
      width: 100%;
    }
    .p-autocomplete{
      width: 100%;
    }
    input{
      width: 100%;
    }
    label{
      padding-left: 10px;
    }
  }
`;

export const BoxAlinhaItemForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const BoxFormItem50 = styled.div`
  width: 50%;
`;

export const BoxFormItem100 = styled.div`
  width: 100%;
`;

export const BoxBtnForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
`;