import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useValidateEmailMutation } from '../../features/auth/authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../../features/auth/authSlice';
import './VerifyEmailPage.css'


function VerifyEmailPage() {

    // Get the verification id and some helpful hooks
    const {verificationId} = useParams()
    const dispatch = useDispatch()

    // Mutation to validate the address
    const [validate, {isSuccess}] = useValidateEmailMutation()

    // State to hold onto any error
    const [error, setError] = useState("")

    /**
     * Function to make a request to validate the email address of the user
     */
    const validateOnLoad = async () => {
        try {
            const userData  = await validate(verificationId).unwrap()
            dispatch(setCredentials({ ...userData}))
        }catch (err){
            const errMsg = (err?.data?.error) ? err?.data?.error : "An unkown error occured, try again or contact support"
            setError(errMsg)
        }
    }

    useEffect(() => {
        /**
         * Function to make a request to validate the email address of the user
         */
        const validateOnLoad = async () => {
            try {
                const userData  = await validate(verificationId).unwrap()
                dispatch(setCredentials({ ...userData}))
            }catch (err){
                const errMsg = (err?.data?.error) ? err?.data?.error : "An unkown error occured, try again or contact support"
                setError(errMsg)
            }
        }
        validateOnLoad()
    },[])


    // Set the content based on state
    let loadingContent = <p className='verify_title'>Loading</p>
    let errorContent = <>
        <p className='verify_title'>Error</p>
        <div className='desc_stuff contact_center'>
            <p className='contact_text'>
                {error}
            </p>
        </div>
    </>
    let successContent = <>
        <p className='verify_title'>Success</p>
        <div className='desc_stuff contact_center'>
            <p className='contact_text'>
                Your email has been successfully verified and you are set to use the website!
            </p>
        </div>
    </>


  return (
    <>
    <div className='verify_wrapper'>
      {(isSuccess)
        ? successContent
        : (error !== "") ?
            errorContent
            : loadingContent
      }
      </div>
    </>
  )
}

export default VerifyEmailPage