// Multi Gift Card Data Form (multi-gift-card-data-form)
(RaiselyComponents, React) => {
  const {styled, css} = RaiselyComponents;
  const {useCommunicator} = RaiselyComponents.Modules;
  const {Button, Input} = RaiselyComponents.Atoms;

  const DEFAULT_MAXLENGTH = 450;
  const NAME = "recipientName";
  const EMAIL = "recipientEmail";
  const GREETING = "greeting";
  const SEND_CONFIRMATION = "sendConfirmation";
  const LIST_HEIGHT = 300;
  const LIST_ERROR_LENGTH = "too-long";
  const LIST_ERROR_CSV_PARSE = "parse-error";
  const LIST_ERROR_LIST_STRING_TOO_LONG = "strings-too-long";

  let csvHeaderStr = "";
  let recipientCSVName = "";
  let recipientCSVEmail = "";

  const StyledContainer = styled("div")`
    > .form-field {
      max-width: 520px;
      margin: 10px 0;
    }
  `;

  const RecipientListWrapper = styled("div")`
    display: grid;
    overflow-y: auto;
    border: 1px solid;

    .list-item {
      padding: 5px;
    }

    .name {
      grid-column-start: 1;
      grid-column-end: 1;
      border-top: 1px solid;
      border-right: 1px solid;
    }

    .email {
      grid-column-start: 2;
      grid-column-end: 2;
      border-top: 1px solid;
    }

    .title {
      font-weight: bold;
      border-top: none;
    }
  `;

  const setListHeight = css`
    max-height: ${LIST_HEIGHT}px;
  `;

  const invalidEmailInputStyle = css`
    color: crimson !important;
  `;

  const messageBroadcasterStyle = css`
    textarea {
      text-align: center;
      margin-top: 5px;
    }

    #message-greeting {
      text-align: center;
      padding-top: 30px;
    }
  `;

  const StyledButton = styled("div")`
    display: flex;

    .invalid-email {
      pointer-events: none;
      opacity: 0.7;
    }
  `;

  const StyledFileUpload = styled("div")`
    border-width: 0 !important;

    .form-field {
      border-width: 0;
      padding: 10px 0;
      cursor: pointer;
    }

    .form-field__label-text {
      text-decoration: underline;
    }

    .form-field--image__message {
      display: none;
    }
  `;

  const DonoAmountWrapper = styled("div")`
    display: flex;
    max-width: 520px;
    flex-flow: row wrap;
    justify-content: space-between
  `;

  function localeTime(time) {
    return new Date(`February 16, 1988 ${time}:00:00`).toLocaleTimeString([], {timeStyle: "short"});
  }

  const emailIsValid = (email) => {
    return email.search(/.+@.+\..+/) > -1;
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
  let messageHelloRendered = false;
  let today = "";

  const RecipientList = (props) => {
    const {recipientList, recipientNameLabel, recipientEmailLabel, showFullListButton, hideFullListButton} = props;

    const containerRef = React.useRef();

    const [fullHeightValue, setFullHeight] = React.useState(false);
    const [showScrollValue, setShowScroll] = React.useState(true);

    const str = `${recipientList.length} recipient${recipientList.length > 1 ? "s" : ""}`;

    const recipients = [<p className="name title list-item">{recipientNameLabel}</p>,
      <p className="email title list-item">{recipientEmailLabel}</p>];
    recipientList.forEach((val) => {
      const name = val[NAME] || "";
      const email = val[EMAIL] || "";
      recipients.push(<p className="name list-item">{name}</p>);
      recipients.push(<p className="email list-item">{email}</p>);
    });

    const showList = () => {
      setFullHeight(true);
    };

    const hideList = () => {
      setFullHeight(false);
    };

    const listClasses = fullHeightValue ? "" : setListHeight;

    const show = containerRef && containerRef.current && containerRef.current.scrollHeight > LIST_HEIGHT;
    if (show !== showScrollValue) {
      // setShowScroll(show);
    }

    return (
      <div ref={containerRef}>
        {recipientList.length ? (
          <>
            <h4>{str}</h4>
            <RecipientListWrapper className={listClasses}>
              {recipients}
            </RecipientListWrapper>
            {showScrollValue ?
              fullHeightValue ?
                <Button theme="primary-hollow" onClick={hideList}>{hideFullListButton}</Button>
                : <Button theme="primary-hollow" onClick={showList}>{showFullListButton}</Button>
              : null}
          </>
        ) : null}
      </div>);
  };

  const AddRecipientBroadcaster = (props) => {
    const {
      recipientNameLabel,
      recipientEmailLabel,
      confirmEmailLabel,
      addRecipientLabel,
      errorMsgNoMatch,
      errorMsgInvalidFormat,
      updatedValue,
      updateRecipientList,
      passClearStateFunc
    } = props;

    const validity = {
      EMPTY: "empty",
      VALID: "valid",
      INVALID_FORMAT: "invalidFormat",
      NOT_MATCHING: "notMatching"
    }

    const [emailValidValue, setEmailValid] = React.useState(validity.EMPTY);
    const [nameValue, setNameValue] = React.useState("");
    const [emailValue, setEmailValue] = React.useState("");
    const [confirmEmailValue, setConfirmEmailValue] = React.useState("");

    const checkEmailValidity = (email, confirmEmail) => {
      const isValid = emailIsValid(email);
      if (!isValid) {
        return validity.INVALID_FORMAT;
      }
      const matches = email && confirmEmail && email.toLowerCase() === confirmEmail.toLowerCase();
      if (!matches) {
        return validity.NOT_MATCHING;
      }
      return validity.VALID;
    }

    const {send, current} = useCommunicator("recipient-list");

    const clearState = () => {
      send && send(undefined);

      setEmailValid(validity.EMPTY);
      setNameValue("");
      setEmailValue("");
      setConfirmEmailValue("");
    }
    passClearStateFunc("recipient-list", clearState);

    const addRecipient = () => {
      if (emailValue && emailValidValue === validity.VALID) {
        const obj = {};
        obj[recipientCSVName] = nameValue;
        obj[recipientCSVEmail] = emailValue;
        updateRecipientList([obj], send);
        setNameValue("");
        setEmailValue("");
        setConfirmEmailValue("");
        setEmailValid(validity.EMPTY);
      }
    };

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
          label={recipientNameLabel}
          id={"broadcasting-input-recipient-name"}
          value={nameValue}
          change={(_id, value) => {
            if (value.length <= DEFAULT_MAXLENGTH && value.indexOf('"') === -1) {
              if (updatedValue) {
                updatedValue(value);
              }
              setNameValue(value);
            }
          }
          }
        />
        <Input
          type="text"
          label={recipientEmailLabel}
          required={true}
          classes={className}
          id="broadcasting-input-recipient-email"
          value={emailValue}
          change={(_id, value) => {
            if (value.length <= DEFAULT_MAXLENGTH && value.indexOf('"') === -1) {
              setEmailValue(value);
              if (value) {
                const checkEmail = checkEmailValidity(value, confirmEmailValue);
                if (checkEmail === validity.VALID) {
                  setEmailValid(checkEmail);
                }
              }
            }
          }
          }
          blur={() => {
            if (emailValidValue === validity.NOT_MATCHING
              || emailValidValue === validity.INVALID_FORMAT) {
              setEmailValid(checkEmailValidity(emailValue, confirmEmailValue));
            }
          }}
        />
        <Input
          type="text"
          label={confirmEmailLabel}
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
        <StyledButton>
          <Button
            className={btnClassName}
            onClick={addRecipient}
          >
            {addRecipientLabel}
          </Button>
        </StyledButton>
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

  const DonoAmountBroadcaster = (props) => {
    const {currencyLabel, currencySelectLabel, currencyList, passClearStateFunc, defaultCurrency} = props;
    const donoAmountId = "donation-amount";

    const donoAmountComm = useCommunicator(donoAmountId);
    const currencySelectComm = useCommunicator("currency-select");

    const clearState = () => {
      donoAmountComm.send(undefined);
      currencySelectComm.send(undefined);
    }
    passClearStateFunc(donoAmountId, clearState);
    const currencies = []
    for (const key in currencyList) {
      currencies.push({
        label: currencyList[key].name,
        value: currencyList[key].code
      });
    }

    const currentCurrency = currencySelectComm.current || defaultCurrency;

    return (
      <>
        <Input
          type="currency"
          required={true}
          label={currencyLabel}
          id={"broadcasting-input-donation-amount"}
          currency={currentCurrency}
          value={donoAmountComm.current}
          change={(_id, value) => {
            donoAmountComm.send(value);
          }
          }
        />
        <Input
          type="select"
          label={currencySelectLabel}
          id={"broadcasting-input-currency-select"}
          options={currencies}
          value={currentCurrency}
          change={(_id, value) => {
            currencySelectComm.send(value);
          }
          }
        />
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
    const {label, passClearStateFunc, firstRecipientName} = props;

    const greetingString = `Hello${firstRecipientName ? ` ${firstRecipientName}` : ""},`;

    const previewMessageComm = useCommunicator("preview-message");
    const messageComm = useCommunicator("message");
    const greetingStringComm = useCommunicator("greeting-string");


    const [messageValue, setMessageValue] = React.useState("");
    const [greetingValue, setGreetingValue] = React.useState("");

    if (greetingStringComm.send && greetingValue !== greetingString) {
      greetingStringComm.send(greetingString);
      setGreetingValue(greetingString);
    }

    const clearState = () => {
      previewMessageComm.send && previewMessageComm.send(undefined);
      messageComm.send && messageComm.send(undefined);
      setMessageValue("");
    }
    passClearStateFunc("message", clearState);

    const messageElement
      = document.getElementById("broadcasting-input-message");

    if (messageElement) {
      if (!messageHelloRendered) {
        messageHelloRendered = true;
        const greeting = document.createElement("div");
        greeting.id = "message-greeting";
        greeting.innerHTML = greetingString;
        messageElement.before(greeting);
      }
    }

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

  const FileUploadBroadcaster = (props) => {
    const {label, updateRecipientList, passClearStateFunc, setListError} = props;
    const [touched, setTouched] = React.useState(false);
    const recipientListComm = useCommunicator("recipient-list");

    const clearState = () => {
      recipientListComm.send && recipientListComm.send(undefined);
      setTouched(false);
    }
    passClearStateFunc("recipient-list", clearState);

    function csvToArray(str) {
      const splitStr = str.split(/\r?\n/);
      const headerIndex = splitStr.findIndex((subStr) => {
        return subStr.includes(csvHeaderStr);
      });

      let arr = [];
      if (headerIndex > -1) {
        const headers = csvHeaderStr.split(",");
        const rows = splitStr.slice(headerIndex + 1);
        arr = rows.map((row) => {
          const values = row.split(",");
          return headers.reduce((object, header, index) => {
            object[header] = values[index];
            return object;
          }, {});
        });
      } else {
        setListError(LIST_ERROR_CSV_PARSE);
      }

      return arr;
    }

    React.useEffect(() => {
      const inputElement
        = document.querySelectorAll("input[type=file]");

      if (inputElement.length) {
        inputElement[0].accept = ".csv";
      }
    });

    return (
      <StyledFileUpload>
        <u>
          <Input
            type="file"
            id={"broadcasting-file-upload"}
            accept=".csv"
            label={label}
            value={false}
            touched={touched}
            change={(_id, value, touched) => {
              setListError();
              fetch(value).then((r) => {
                r.text().then((d) => {
                  const data = csvToArray(d);
                  updateRecipientList(data, recipientListComm.send);
                })
              })
              setTouched(touched);
            }
            }
          />
        </u>
      </StyledFileUpload>
    );
  };

  const clearFunctions = {};

  return (props) => {
    const [recipientNameVal, setRecipientName] = React.useState("");
    const [senderNameVal, setSenderName] = React.useState("");
    const [headerPreviewVal, setHeaderPreview] = React.useState("");
    const [recipientListVal, setRecipientList] = React.useState([]);
    const [listErrorVal, setListError] = React.useState();
    const values = props.getValues();

    csvHeaderStr = `${values.recipientNameLabel},${values.recipientEmailLabel}`;
    recipientCSVName = values.recipientNameLabel;
    recipientCSVEmail = values.recipientEmailLabel;

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

    const updateRecipientList = (data, send) => {
      const updatingList = JSON.parse(JSON.stringify(recipientListVal));
      data.forEach((val) => {
        const name = val[recipientCSVName] ? ` ${val[recipientCSVName]}` : "";
        let email = val[recipientCSVEmail];
        if (!email) return;
        email = email.toLowerCase();
        if (emailIsValid(email)) {
          const repeatEmail = updatingList.findIndex((existingVal) => {
            return email === existingVal[EMAIL];
          }) > -1;
          if (!repeatEmail) {
            const entry = {
              [NAME]: name,
              [EMAIL]: email,
              [GREETING]: `Hello${name},`,
              [SEND_CONFIRMATION]: updatingList.length ? "false" : "true"
            };
            updatingList.push(entry);
          }
        }
      });

      if (updatingList.length !== recipientListVal.length) {
        if (updatingList.length > 100) {
          setListError(LIST_ERROR_LENGTH);
        } else if (JSON.stringify(updatingList).length > 25000) {
          setListError(LIST_ERROR_LIST_STRING_TOO_LONG);
        } else {
          if (send) {
            send(updatingList);
          }
          setRecipientList(updatingList);
        }
      }
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
      setRecipientList([]);
    }

    const downloadTemplate = () => {
      return () => {
        const a = document.createElement("a");
        a.href = `data:text/csv;charset=utf-8,${encodeURI(csvHeaderStr)}`;
        a.download = `${values.csvTemplateName}.csv`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }

    const DownloadTemplateLink = () => {
      const href = `data:text/csv;charset=utf-8,${encodeURI(csvHeaderStr)}`;
      const download = `${values.csvTemplateName}.csv`;
      return (
        <a className="form-field__label-text" href={href} download={download}
           target="_blank">{values.downloadCSVTemplate}</a>
      );
    }

    const firstRecipientName = recipientListVal.length ? recipientListVal[0][values.recipientNameLabel] || "" : "[recipient name]";

    let listError = "";
    switch(listErrorVal) {
      case LIST_ERROR_LENGTH:
        listError = values.errorTooManyEmails;
        break;
      case LIST_ERROR_CSV_PARSE:
        listError = values.errorCSVParse;
        break;
      case LIST_ERROR_LIST_STRING_TOO_LONG:
        listError = values.errorListStringsTooLong;
        break;
    }

    return (
      <StyledContainer>
        <h4>{values.header}</h4>
        <AddRecipientBroadcaster
          recipientNameLabel={values.recipientNameLabel}
          recipientEmailLabel={values.recipientEmailLabel}
          confirmEmailLabel={values.confirmRecipientEmailLabel}
          updatedValue={updateRecipientName(values.emailSubject)}
          updateRecipientList={updateRecipientList}
          addRecipientLabel={values.addRecipientLabel}
          errorMsgNoMatch={values.errorMsgNoMatch}
          errorMsgInvalidFormat={values.errorMsgInvalidFormat}
          passClearStateFunc={setClearStateFunc}
        />
        <RecipientList
          recipientNameLabel={values.recipientNameLabel}
          recipientEmailLabel={values.recipientEmailLabel}
          recipientList={recipientListVal}
          passClearStateFunc={setClearStateFunc}
          showFullListButton={values.showFullListButton}
          hideFullListButton={values.hideFullListButton}
        />
        <h4>{values.uploadMessage}</h4>
        <DownloadTemplateLink/>
        <FileUploadBroadcaster
          label={values.uploadCSVFile}
          updateRecipientList={updateRecipientList}
          passClearStateFunc={setClearStateFunc}
          setListError={setListError}
        />
        {listError && <div className={invalidEmailInputStyle}>{listError}</div>}
        <SenderBroadcaster
          label={values.senderNameLabel}
          headerPreview={values.headerPreviewVal}
          updateSenderName={updateSenderName(values.emailSubject)}
          passClearStateFunc={setClearStateFunc}
        />
        <DonoAmountBroadcaster
          currencyLabel={values.donationAmountLabel}
          currencySelectLabel={values.currencySelectLabel}
          passClearStateFunc={setClearStateFunc}
          defaultCurrency={props.global.detectedCurrency}
          currencyList={props.global.currencies}
        />
        <CheckboxBroadcaster
          label={values.donationCheckboxLabel}
          passClearStateFunc={setClearStateFunc}
        />
        <DropdownBroadcaster
          timingDropdownLabel={values.timingDropdownLabel}
          dateLabel={values.dateLabel}
          timeLabel={values.timeLabel}
          emailSubject={values.emailSubject}
          passClearStateFunc={setClearStateFunc}
        />
        <MessageBroadcaster
          label={values.messageLabel}
          passClearStateFunc={setClearStateFunc}
          firstRecipientName={firstRecipientName}
        />
      </StyledContainer>
    );
  }
}
