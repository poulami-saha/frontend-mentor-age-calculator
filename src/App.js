import { useState } from "react";
import styles from "./App.module.css";
import calculate from "./assets/calculate.png";
import disabled from "./assets/Disabled.png";

function App() {
  const [dateOfBirth, setDateOfBirth] = useState({
    day: undefined,
    month: undefined,
    year: undefined,
  });
  const [dateError, setDateError] = useState({
    day: undefined,
    month: undefined,
    year: undefined,
  });
  const [age, setAge] = useState({
    year: undefined,
    month: undefined,
    day: undefined,
  });

  const [shouldCalculate, setShouldCalculate] = useState(true);
  const thirtyOneDayMonth = [1, 3, 5, 7, 8, 10, 12];
  const februaryMonth = 2;
  const currentYear = new Date().getFullYear();
  const isLeapYear = (year) => year % 4 === 0;
  const isLeapCenturyYear = (year) => year % 400 === 0;

  const setDate = (type, value) => {
    setShouldCalculate(true);
    setAge({
      year: undefined,
      month: undefined,
      day: undefined,
    });
    setDateOfBirth({
      ...dateOfBirth,
      [type]: +value,
    });
    validate(type, value);
  };

  const validate = (type, value) => {
    if (dateError[type]) {
      setShouldCalculate(true);
      setDateError((prev) => {
        return {
          ...prev,
          [type]: undefined,
        };
      });
    }
    if (value === "" || value === undefined || isNaN(value)) {
      setShouldCalculate(false);
      setDateError((prev) => {
        return {
          ...prev,
          [type]: "This field is required",
        };
      });
      return false;
    }
    if (type === "year") {
      if (value >= currentYear) {
        setShouldCalculate(false);
        setDateError((prev) => {
          return { ...prev, [type]: "Must be in the past" };
        });
        return false;
      }
    }
    if (type === "month") {
      if (value > 12 || value < 1) {
        setShouldCalculate(false);
        setDateError((prev) => {
          return { ...prev, [type]: "Must be a valid month" };
        });
        return false;
      }
    }
    if (type === "day") {
      if (value < 1 || value > 31) {
        setShouldCalculate(false);
        setDateError((prev) => {
          return { ...prev, [type]: "Must be a valid day" };
        });
        return false;
      }
      if (dateOfBirth.month === februaryMonth) {
        if (
          dateOfBirth.year % 100 === 0 &&
          !isLeapCenturyYear(dateOfBirth.year) &&
          value > 28
        ) {
          setShouldCalculate(false);
          setDateError((prev) => {
            return { ...prev, [type]: "Must be a valid day" };
          });
          return false;
        }
        if (!isLeapYear(dateOfBirth.year) && value > 28) {
          setShouldCalculate(false);
          setDateError((prev) => {
            return { ...prev, [type]: "Must be a valid day" };
          });
          return false;
        }
      }

      if (value === 31 && !thirtyOneDayMonth.includes(dateOfBirth.month)) {
        setShouldCalculate(false);
        setDateError((prev) => {
          return { ...prev, [type]: "Must be a valid day" };
        });
        return false;
      }
    }
    return true;
  };
  const validateDate = () => {
    const isValidYear = validate("year", dateOfBirth.year);
    const isValidMonth = validate("month", dateOfBirth.month);
    const isValidDay = validate("day", dateOfBirth.day);
    return isValidYear && isValidMonth && isValidDay;
  };

  const calculateDateDifference = () => {
    if (validateDate()) {
      const startDate = new Date(
        dateOfBirth.year,
        dateOfBirth.month,
        dateOfBirth.day
      );
      const endDate = new Date();

      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() + 1 - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();

      // Adjust months and days if necessary
      if (days < 0) {
        // Borrow days from the previous month
        months--;
        days += new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          0
        ).getDate();
      }

      if (months < 0) {
        // Borrow months from the previous year
        years--;
        months += 12;
      }

      setAge({
        year: years,
        month: months,
        day: days,
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.formInput}>
            <h4
              className={`${styles.label} ${
                dateError.day ? styles.errorLabel : ""
              }`}
            >
              Day
            </h4>
            <input
              type="number"
              className={styles.input}
              onChange={(e) => setDate("day", e.target.value)}
              placeholder="DD"
            />
            {dateError.day && <p className={styles.error}>{dateError.day}</p>}
          </div>
          <div className={styles.formInput}>
            <h4
              className={`${styles.label} ${
                dateError.month ? styles.errorLabel : ""
              }`}
            >
              Month
            </h4>
            <input
              type="number"
              className={styles.input}
              onChange={(e) => setDate("month", e.target.value)}
              placeholder="MM"
            />
            {dateError.month && (
              <p className={styles.error}>{dateError.month}</p>
            )}
          </div>
          <div className={styles.formInput}>
            <h4
              className={`${styles.label} ${
                dateError.year ? styles.errorLabel : ""
              }`}
            >
              Year
            </h4>
            <input
              type="number"
              className={styles.input}
              onChange={(e) => setDate("year", e.target.value)}
              placeholder="YYYY"
            />
            {dateError.year && <p className={styles.error}>{dateError.year}</p>}
          </div>
        </div>
        <div className={styles.image}>
          <img
            src={!shouldCalculate ? disabled : calculate}
            onClick={calculateDateDifference}
          />
        </div>
        <div div className={styles.resultContainer}>
          <p className={styles.result}>
            {age.year !== undefined ? (
              <span className={styles.count}>{age.year}</span>
            ) : (
              <>
                <span className={styles.parallelogram}></span>
                <span className={styles.parallelogram}></span>
              </>
            )}{" "}
            {age.year !== undefined && age.year > 1 ? "years" : "year"}
          </p>
          <p className={styles.result}>
            {age.month !== undefined ? (
              <span className={styles.count}>{age.month}</span>
            ) : (
              <>
                <span className={styles.parallelogram}></span>
                <span className={styles.parallelogram}></span>
              </>
            )}{" "}
            {age.month !== undefined && age.month > 1 ? "months" : "month"}
          </p>
          <p className={styles.result}>
            {age.day !== undefined ? (
              <span className={styles.count}>{age.day}</span>
            ) : (
              <>
                <span className={styles.parallelogram}></span>
                <span className={styles.parallelogram}></span>
              </>
            )}{" "}
            {age.day !== undefined && age.day > 1 ? "days" : "day"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
