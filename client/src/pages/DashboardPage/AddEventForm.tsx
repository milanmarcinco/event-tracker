import { useForm, Controller, SubmitHandler } from "react-hook-form";

import Input from "../../components/reusable/Input";
import Button from "../../components/reusable/Button";
import DropdownInput from "../../components/reusable/DropdownInput";

import { createEvent } from "../../store/eventsSlice";
import useDispatch from "../../hooks/useDispatch";

import styles from "./DashboardPage.module.scss";

interface IProps {
  handleCancel: () => void;
}

interface IForm {
  eventDescription: string;
  month: {
    label: string;
    value: string;
  };
  day: {
    label: string;
    value: string;
  };
  // colorTag: string;
}

const AddEventForm = ({ handleCancel }: IProps) => {
  const dispatch = useDispatch();

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    watch,
    reset,
  } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = async ({ eventDescription, month, day }) => {
    await dispatch(
      createEvent({
        description: eventDescription,
        month: parseInt(month.value),
        day: parseInt(day.value),
        colorTag: "#cecece",
      })
    );

    reset();
    handleCancel();
  };

  let monthsOptions: { label: string; value: string }[] = [];
  for (let i = 1; i <= 12; i++) {
    monthsOptions.push({ label: i.toString(), value: i.toString() });
  }

  const selectedMonth = Number(watch("month")?.value);
  const daysInMonth = new Date(new Date().getFullYear(), selectedMonth, 0).getDate();
  let daysOptions: { label: string; value: string }[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    daysOptions.push({ label: i.toString(), value: i.toString() });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.addEventForm}>
      <div>
        <Input
          placeholder="Event description"
          {...register("eventDescription", {
            required: "Event description is required",
            maxLength: { value: 50, message: "Description is too long" },
          })}
        />
        {errors.eventDescription && <p className={styles.errorMessage}>{errors.eventDescription.message}</p>}
      </div>

      <div className={styles.inputGroup}>
        <Controller
          name="month"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value, ref } }) => (
            <DropdownInput
              placeholder="Month"
              options={monthsOptions}
              onChange={onChange}
              selectedOption={value}
              ref={ref}
            />
          )}
        />

        <Controller
          name="day"
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value, ref } }) => (
            <DropdownInput
              placeholder="Day"
              options={daysOptions}
              onChange={onChange}
              selectedOption={value}
              ref={ref}
              disabled={!selectedMonth}
            />
          )}
        />
      </div>

      <div className={styles.controls}>
        <Button title="Cancel" type="button" variant="secondary" onClick={handleCancel} />
        <Button title="Add new event" type="submit" variant="primary" onClick={undefined} />
      </div>
    </form>
  );
};

export default AddEventForm;
