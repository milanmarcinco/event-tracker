import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";

import { deleteProfile } from "../../services/auth";

import useSelector from "../../hooks/useSelector";
import useDispatch from "../../hooks/useDispatch";
import { refreshTokenSelector } from "../../store/selectors";
import { logOut } from "../../store/authSlice";

import styles from "./UpdateProfilePage.module.scss";

interface IFormInputs {
  password: string;
}

const DeleteProfileForm = () => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [confirmStep, setConfirmStep] = useState(false);

  const refreshToken = useSelector(refreshTokenSelector);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInputs>({});

  const deleteSubmitHandler: SubmitHandler<IFormInputs> = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setError("");

        await deleteProfile(formData, refreshToken as string);

        setLoading(false);

        dispatch(logOut());

        setTimeout(() => {
          navigate("/login", { state: { success: "Your account was successfully deleted" } });
        }, 0);
      } catch (err: any) {
        setLoading(false);
        setError(err.message);
        setConfirmStep(false);
        reset();
      }
    },
    [refreshToken, dispatch, navigate, reset]
  );

  const setConfirmTrue = () => {
    setConfirmStep(true);
    setError("");
  };

  const setConfirmFalse = () => {
    setConfirmStep(false);
    reset();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(deleteSubmitHandler)}>
      {error && <p className={styles.errorBanner}>{error}</p>}

      {confirmStep && (
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register("password", { required: true })} className={styles.red} />
          {errors.password?.type === "required" && <p className={styles.errorMessage}>Enter your password</p>}
        </div>
      )}

      <div className={styles.formButtonsWrapper}>
        {!confirmStep && (
          <button onClick={setConfirmTrue} className={styles.dangerBtn} type="button" disabled={loading}>
            DELETE ACCOUNT
          </button>
        )}
        {confirmStep && (
          <>
            <button onClick={setConfirmFalse} className={styles.confirmBtn} type="reset" disabled={loading}>
              No, cancel
            </button>
            <button className={styles.dangerBtn} type="submit" disabled={loading}>
              {loading ? "Deleting..." : "Yes, delete"}
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default DeleteProfileForm;
