// Gift Card Data Form (dev-gift-card-data-form)
(RaiselyComponents, React) => {
  const {styled, css} = RaiselyComponents;
  const {useCommunicator} = RaiselyComponents.Modules;
  const {Input} = RaiselyComponents.Atoms;

  const DEFAULT_MAXLENGTH = 450;

  const StyledContainer = styled("div")`
    > .form-field {
      max-width: 520px;
      margin: 10px 0;
    }
  `;

  const invalidEmailInputStyle = css`
    color: crimson !important;
  `;

  const messageBroadcasterStyle = css`
    textarea {
      text-align: center;
    }
  `;

  function localeTime(time) {
    return new Date(`February 16, 1988 ${time}:00:00`).toLocaleTimeString([], {timeStyle: "short"});
  }

  function convertDateToCalendarString(date) {
    return `${date.getFullYear()}-${
      (date.getMonth() + 1)
        .toLocaleString('en-US',
          {minimumIntegerDigits: 2, useGrouping: false})
    }-${
      date.getDate()
        .toLocaleString('en-US',
          {minimumIntegerDigits: 2, useGrouping: false})
    }`;
  }

  const timeOptions = [
    {value: "00", label: localeTime("00")},
    {value: "01", label: localeTime("01")},
    {value: "02", label: localeTime("02")},
    {value: "03", label: localeTime("03")},
    {value: "04", label: localeTime("04")},
    {value: "05", label: localeTime("05")},
    {value: "06", label: localeTime("06")},
    {value: "07", label: localeTime("07")},
    {value: "08", label: localeTime("08")},
    {value: "09", label: localeTime("09")},
    {value: "10", label: localeTime("10")},
    {value: "11", label: localeTime("11")},
    {value: "12", label: localeTime("12")},
    {value: "13", label: localeTime("13")},
    {value: "14", label: localeTime("14")},
    {value: "15", label: localeTime("15")},
    {value: "16", label: localeTime("16")},
    {value: "17", label: localeTime("17")},
    {value: "18", label: localeTime("18")},
    {value: "19", label: localeTime("19")},
    {value: "20", label: localeTime("20")},
    {value: "21", label: localeTime("21")},
    {value: "22", label: localeTime("22")},
    {value: "23", label: localeTime("23")}
  ];

  let dateAndTimeOptionsSetup = false;
  let today = "";

  const Broadcaster = (props) => {
    const {communicatorId, label, required, updatedValue, passClearStateFunc, ...rest} = props;
    const communicator = useCommunicator(communicatorId);
    const type = props.type || "text";
    const clearState = () => {
      communicator.send && communicator.send(undefined);
    }
    passClearStateFunc(communicatorId, clearState);

    return (
      <Input
        type={type}
        label={label}
        required={required}
        id={`broadcasting-input-${communicatorId}`}
        value={communicator.current || ''}
        change={(_id, value) => {
          if (value.length <= DEFAULT_MAXLENGTH && value.indexOf('"') === -1) {
            communicator.send(value);
            if (updatedValue) {
              updatedValue(value);
            }
          }
        }
        }
      />
    );
  };

  const EmailBroadcaster = (props) => {
    const {label, confirmLabel, errorMsgNoMatch, errorMsgInvalidFormat, passClearStateFunc} = props;

    const recipientEmailComm = useCommunicator("recipient-email");
    const isValidEmailComm = useCommunicator("valid-email");

    const validity = {
      EMPTY: "empty",
      VALID: "valid",
      INVALID_FORMAT: "invalidFormat",
      NOT_MATCHING: "notMatching"
    }

    const [emailValidValue, setEmailValid] = React.useState(validity.EMPTY);
    const [emailValue, setEmailValue] = React.useState("");
    const [confirmEmailValue, setConfirmEmailValue] = React.useState("");

    const checkEmailValidity = (email, confirmEmail) => {
      const isValid = email.search(/.+@.+\..+/) > -1;
      if (!isValid) {
        return validity.INVALID_FORMAT;
      }
      const matches = email && confirmEmail && email.toLowerCase() === confirmEmail.toLowerCase();
      if (!matches) {
        return validity.NOT_MATCHING;
      }
      return validity.VALID;
    }

    const clearState = () => {
      recipientEmailComm.send && recipientEmailComm.send(undefined);
      isValidEmailComm.send && isValidEmailComm.send(false);

      setEmailValid(validity.EMPTY);
      setEmailValue("");
      setConfirmEmailValue("");
    }
    passClearStateFunc("recipient-email", clearState);
    let currentEmailStringisValid = true;

    const errorMsg =
      emailValidValue === validity.INVALID_FORMAT
        ? errorMsgInvalidFormat : emailValidValue === validity.NOT_MATCHING
          ? errorMsgNoMatch : "";
    const className =
      (emailValidValue === validity.VALID || emailValidValue === validity.EMPTY) ? "" : invalidEmailInputStyle;
    const btnClassName =
      emailValidValue === validity.VALID ? "" : "invalid-email";

    return (
      <>
        <Input
          type="text"
          label={label}
          required={true}
          classes={className}
          id="broadcasting-input-recipient-email"
          value={emailValue}
          change={(_id, value) => {
            if (value.length <= DEFAULT_MAXLENGTH && value.indexOf('"') === -1) {
              recipientEmailComm.send(value);
              setEmailValue(value);
              if (value) {
                const checkEmail = checkEmailValidity(value, confirmEmailValue);
                if (checkEmail === validity.VALID) {
                  setEmailValid(checkEmail);
                }
                isValidEmailComm.send(checkEmail === validity.VALID);
              }
            }
          }
          }
          blur={() => {
            if (emailValidValue === validity.NOT_MATCHING || emailValidValue === validity.INVALID_FORMAT) {
              setEmailValid(checkEmailValidity(emailValue, confirmEmailValue));
            }
          }}
        />
        <Input
          type="text"
          label={confirmLabel}
          required={true}
          classes={className}
          id="broadcasting-input-confirm-recipient-email"
          value={confirmEmailValue}
          change={(_id, value) => {
            if (value.length <= DEFAULT_MAXLENGTH && value.indexOf('"') === -1) {
              setConfirmEmailValue(value);
              if (value) {
                const checkEmail = checkEmailValidity(emailValue, value);
                if (checkEmail === validity.VALID) {
                  setEmailValid(checkEmail);
                }
                isValidEmailComm.send(checkEmail === validity.VALID);
              }
            }
          }
          }
          blur={() => {
            setEmailValid(checkEmailValidity(emailValue, confirmEmailValue));
          }}
        />
        {errorMsg &&
        <div className={invalidEmailInputStyle}>
          {errorMsg}
        </div>
        }
      </>
    );
  };

  const SenderBroadcaster = (props) => {
    const {label, headerPreview, passClearStateFunc} = props;
    const [senderNameVal, setSenderNameVal] = React.useState(null);
    const senderId = "sender-name";

    const senderNameComm = useCommunicator(senderId);

    if (senderNameVal === null) {
      // check sessionStorage for saved sender name
      const savedName = window.sessionStorage.getItem(senderId) || "";
      setSenderNameVal(savedName);
    }

    const updateSenderName = (name) => {
      setSenderNameVal(name);
      senderNameComm.send(name);
      props.updateSenderName(name);
      window.sessionStorage.setItem(senderId, name);
    };

    const clearState = () => {
      // don't clear sender state at this time
      // senderNameComm.send && senderNameComm.send(undefined);
    }
    passClearStateFunc("sender-name", clearState);

    return (
      <>
        <Input
          type="text"
          label={label}
          errors={["val must be added"]}
          id={`broadcasting-input-sender-name`}
          value={senderNameVal}
          change={(_id, value) => {
            if (value.length <= DEFAULT_MAXLENGTH && value.indexOf('"') === -1) {
              updateSenderName(value);
            }
          }
          }
        />
        {headerPreview ? <>Subject: <i>{headerPreview}</i></> : null}
      </>
    );
  };

  const DropdownBroadcaster = (props) => {
    const {passClearStateFunc} = props;

    const whenSendComm = useCommunicator("when-to-send");
    const dateComm = useCommunicator("send-date");
    const timeComm = useCommunicator("send-time");

    const [dropValue, setDropValue] = React.useState("immediate");
    const [timeValue, setTimeValue] = React.useState("00");
    const [activeTimeOptions, setActiveTimeOptions] = React.useState(timeOptions);
    let currentDate = new Date();

    const clearState = () => {
      whenSendComm.send && whenSendComm.send(undefined);
      dateComm.send && dateComm.send(undefined);
      timeComm.send && timeComm.send(undefined);

      setDropValue("immediate");
      setTimeValue("00");
      setActiveTimeOptions(timeOptions);
    }
    passClearStateFunc("when-to-send", clearState);

    React.useEffect(() => {
      if (dropValue === "immediate") {
        dateAndTimeOptionsSetup = false;
      }

      currentDate = new Date();
      today = convertDateToCalendarString(currentDate);
      let initialDate = today;
      let currentHour = currentDate.getHours() + 1;
      if (currentHour === 24) {
        const nextDay = new Date();
        nextDay.setUTCDate(currentDate.getUTCDate() + 1);
        // if between 11pm and midnight, move to the next day.
        initialDate = convertDateToCalendarString(nextDay);
        currentHour = 0;
      }

      const dateInputElement
        = document.getElementById("broadcasting-input-send-date");

      if (dateInputElement) {
        if (!dateAndTimeOptionsSetup) {
          const oneYearLater = new Date();
          oneYearLater.setFullYear(currentDate.getFullYear() + 1);
          const oneYear = convertDateToCalendarString(oneYearLater);

          dateInputElement.type = "date";
          dateInputElement.value = initialDate;
          dateInputElement.min = initialDate;
          dateInputElement.max = oneYear;

          // set up initial values for send time
          dateComm.send(initialDate);
          timeComm.send((timeOptions[currentHour] || {}).value)
          dateAndTimeOptionsSetup = true;
        }

        let newTimeOptions = [];
        if (dateInputElement.value === today) {
          newTimeOptions = timeOptions.slice(currentHour);
        } else {
          newTimeOptions = timeOptions;
        }
        if (newTimeOptions.length !== activeTimeOptions.length) {
          setActiveTimeOptions(newTimeOptions);
        }
        if (newTimeOptions.length !== activeTimeOptions.length) {
          setActiveTimeOptions(newTimeOptions);
        }
      }
    });

    const showDateOpns = dropValue === "chooseDate";

    return (
      <>
        <Input
          type="select"
          value={dropValue}
          options={[
            {value: "immediate", label: "Immediately"},
            {value: "chooseDate", label: "Choose a date..."}
          ]}
          required={false}
          label={props.timingDropdownLabel}
          change={
            (id, value) => {
              if (value === "immediate") {
                if (dateComm.send) {
                  dateComm.send("");
                }
                if (timeComm.send) {
                  timeComm.send("");
                }
              }
              setDropValue(value);
            }
          }
          style={{width: "30px"}}
        />
        <Input
          type="text"
          label={props.dateLabel}
          id={"broadcasting-input-send-date"}
          value={dateComm.current || today}
          active={showDateOpns}
          change={
            (_id, value) => {
              if (dateComm.send) {
                dateComm.send(value);
              }
            }
          }
        />
        <Input
          type="select"
          label={props.timeLabel}
          id={"broadcasting-input-send-time"}
          value={timeValue}
          options={activeTimeOptions}
          active={showDateOpns}
          change={
            (_id, value) => {
              if (timeComm.send) {
                timeComm.send(value);
              }
              setTimeValue(value);
            }
          }
          style={{width: "30px"}}
        />
      </>
    );
  };

  const CheckboxBroadcaster = (props) => {
    const {label, passClearStateFunc} = props;
    const showDonationId = "show-donation";

    const showDonationComm = useCommunicator(showDonationId);

    const clearState = () => {
      showDonationComm.send(undefined);
    }
    passClearStateFunc(showDonationId, clearState);

    return (
      <Input
        type="checkbox"
        label={label}
        id={`broadcasting-input-show-donation`}
        value={showDonationComm.current}
        change={(_id, value) => {
          showDonationComm.send(value);
        }
        }
      />
    );
  };

  const MessageBroadcaster = (props) => {
    const {label, passClearStateFunc} = props;

    const previewMessageComm = useCommunicator("preview-message");
    const messageComm = useCommunicator("message");

    const [messageValue, setMessageValue] = React.useState("");

    const clearState = () => {
      previewMessageComm.send && previewMessageComm.send(undefined);
      messageComm.send && messageComm.send(undefined);
      setMessageValue("");
    }
    passClearStateFunc("message", clearState);

    return (
      <Input
        type="textarea"
        label={label}
        id={"broadcasting-input-message"}
        value={messageValue}
        classes={messageBroadcasterStyle}
        change={(_id, value) => {
          const splitByNL = value.split(/\r?\n/);
          const replaceSpaces = splitByNL.map((str) => {
            if (str.trim().length === 0) {
              return "";
            }
            return str.replace(/\s/gy, "&nbsp;");
          });
          let fixedMessage = replaceSpaces.join("<br \/>");
          fixedMessage = fixedMessage.replaceAll('"', "&quot;");

          if (fixedMessage.length <= 500) {
            messageComm.send(fixedMessage);
            previewMessageComm.send(value);
            setMessageValue(value);
          }
        }
        }
      />
    );
  };

  const clearFunctions = {};

  return (props) => {
    const [recipientNameVal, setRecipientName] = React.useState("");
    const [senderNameVal, setSenderName] = React.useState("");
    const [headerPreviewVal, setHeaderPreview] = React.useState("");
    const values = props.getValues();

    const updateHeaderPreviewState = (senderName, recipientName) => {
      let headerPreview = "";
      if (senderName) {
        headerPreview = values.emailSubject
          .replaceAll("{sender}", senderName)
          .replaceAll(" {recipientName}",
            recipientName ? ` ${recipientName}` : recipientName) //hide space
          .replaceAll("{recipientName}", recipientName);
      }
      setSenderName(senderName);
      setRecipientName(recipientName);
      setHeaderPreview(headerPreview);
    }

    const updateRecipientName = () => {
      return (recipientName) => {
        updateHeaderPreviewState(senderNameVal, recipientName);
      };
    }

    const updateSenderName = () => {
      return (senderName) => {
        updateHeaderPreviewState(senderName, recipientNameVal);
      };
    }

    const setClearStateFunc = (id, clearState) => {
      clearFunctions[id] = clearState;
    }

    const resetFormState = useCommunicator("reset-fields");
    if (resetFormState.current) {
      // reset state in form components
      for (const key in clearFunctions) {
        if (clearFunctions[key]) {
          clearFunctions[key]();
        }
      }

      // then set reset state back
      if (resetFormState.send) {
        resetFormState.send(false);
      }
      updateHeaderPreviewState(senderNameVal, "");
    }

    return (
      <StyledContainer>
        <h4>{values.dataHeader}</h4>
        <Broadcaster
          communicatorId={"recipient-name"}
          label={values.recipientNameLabel}
          updatedValue={updateRecipientName()}
          passClearStateFunc={setClearStateFunc}
        />
        <EmailBroadcaster
          label={values.recipientEmailLabel}
          confirmLabel={values.confirmRecipientEmailLabel}
          errorMsgNoMatch={values.errorMsgNoMatch}
          errorMsgInvalidFormat={values.errorMsgInvalidFormat}
          passClearStateFunc={setClearStateFunc}
        />
        <SenderBroadcaster
          label={values.senderNameLabel}
          headerPreview={headerPreviewVal}
          updateSenderName={updateSenderName()}
          passClearStateFunc={setClearStateFunc}
        />
        <CheckboxBroadcaster
          label={values.donationCheckboxLabel}
          passClearStateFunc={setClearStateFunc}
        />
        <DropdownBroadcaster
          timingDropdownLabel={values.timingDropdownLabel}
          dateLabel={values.dateLabel}
          timeLabel={values.timeLabel}
          passClearStateFunc={setClearStateFunc}
        />
        <MessageBroadcaster
          label={values.messageLabel}
          passClearStateFunc={setClearStateFunc}
        />
      </StyledContainer>
    );
  }
}
