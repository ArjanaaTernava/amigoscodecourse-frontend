import { Formik, Form, useField } from 'formik';
import {FormLabel, Input, Alert, AlertIcon,Box, Button, Stack} from '@chakra-ui/react'
import * as Yup from 'yup';
import { updateCustomer } from '/src/services/Client';
import { errorNotification, successNotification } from '/src/services/Notification';

const MyTextInput = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <Box>
      <FormLabel htmlFor={props.id || props.name}>{label}</FormLabel>
      <Input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <Alert className="error" status='error' mt={2}>
            <AlertIcon/>
            {meta.error}
        </Alert>
      ) : null}
    </Box>
  );
};


// And now we can use these
const UpdateCustomerForm = ({fetchCustomers, initialValues, customerId}) => {
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
          name: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
          email: Yup.string()
            .email('Invalid email address')
            .required('Required'),
          age: Yup.number()
                .min(16, 'Must be at least 16 years old')
                .max(100, 'Must be less than 100 years old')
                .required('Required'),
        })}
        onSubmit={(updatedCustomer, { setSubmitting }) => {
            updateCustomer(customerId,updatedCustomer).then(res => {
              setSubmitting(true);
              console.log(res);
              successNotification("Customer updated",`${updatedCustomer.name} was successfully updated`)
              fetchCustomers();
            }).catch(err => {
              errorNotification(err.code,
                err.response.data.message);
            }).finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {( {isValid, isSubmitting} )=> (
                    <Form>
                    <Stack spacing={"24px"}>
                    <MyTextInput
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Jane"
                  />
        
                  <MyTextInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="jane@formik.com"
                  />
        
        
                  <MyTextInput
                    label="Age"
                    name="age"
                    type="number"
                    placeholder="24"
                  />
        
                  <Button disabled={!isValid || isSubmitting} type="submit">Submit</Button>
                    </Stack>
                </Form>
        )}
      </Formik>
    </>
  );
};

export default UpdateCustomerForm;