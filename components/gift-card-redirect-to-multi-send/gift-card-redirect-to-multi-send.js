// Gift Card Redirect Button (gift-card-redirect-to-multi-send)
(RaiselyComponents) => {
  const {styled, css} = RaiselyComponents;
  const { Button } = RaiselyComponents.Atoms;

  const StyledButton = styled("div")`
    display: flex;
    justify-content: ${
      (props) => props.buttonPosition === "left" ? "flex-start"
        : props.buttonPosition === "right" ? "flex-end" : "center"
    };
  `;

  return (props) => {
    const values = props.getValues();

    return (
      <StyledButton buttonPosition={values.giftCardRedirectButtonPosition}>
        <Button
          theme="primary"
          disabled={false}
          href={`/${values.sendMultiRedirectURL}`}
          >{values.redirectButtonLabel}
        </Button>
      </StyledButton>
    );
  }
}