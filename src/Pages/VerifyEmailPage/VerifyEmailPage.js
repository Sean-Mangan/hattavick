import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useValidateEmailMutation } from "../../features/auth/authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import "./VerifyEmailPage.css";
import Settings from "../../config/settings.json";

/**
 * VerifyEmailPage component handles email verification via link.
 * Automatically validates the email on page load and displays the result.
 *
 * @returns {JSX.Element} The email verification page
 */
function VerifyEmailPage() {
  // Get the verification id and hooks
  const { verificationId } = useParams();
  const dispatch = useDispatch();

  // Mutation to validate the email address
  const [validate, { isSuccess }] = useValidateEmailMutation();

  // State to hold any error
  const [error, setError] = useState("");

  /**
   * Validates the user's email address.
   * Dispatches credentials on success or sets error on failure.
   */
  const validateOnLoad = async () => {
    try {
      const userData = await validate(verificationId).unwrap();
      dispatch(setCredentials({ ...userData }));
    } catch (error) {
      const errorMsg =
        error?.data?.error || Settings.DEFAULTS.DEFAULT_ERROR_MESSAGE;
      setError(errorMsg);
    }
  };

  // Validate email on component mount
  useEffect(() => {
    validateOnLoad();
  }, []);

  // Set the content based on state
  const loadingContent = <p className="verify_title">Loading</p>;

  const errorContent = (
    <>
      <p className="verify_title">Error</p>
      <div className="desc_stuff contact_center">
        <p className="contact_text">{error}</p>
      </div>
    </>
  );

  const successContent = (
    <>
      <p className="verify_title">Success</p>
      <div className="desc_stuff contact_center">
        <p className="contact_text">
          Your email has been successfully verified and you are set to use the
          website!
        </p>
      </div>
    </>
  );

  return (
    <div className="verify_wrapper">
      {isSuccess ? successContent : error ? errorContent : loadingContent}
    </div>
  );
}

export default VerifyEmailPage;
