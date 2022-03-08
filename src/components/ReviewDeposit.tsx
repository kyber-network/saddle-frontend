// import "./ReviewDeposit.scss"

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Divider,
  Typography,
  styled,
} from "@mui/material"
import React, { ReactElement, useState } from "react"
import {
  commify,
  formatBNToPercentString,
  formatBNToString,
  formatDeadlineToNumber,
} from "../utils"

import { AppState } from "../state/index"
import { DepositTransaction } from "../interfaces/transactions"
import DialogTitle from "./DialogTitle"
import HighPriceImpactConfirmation from "./HighPriceImpactConfirmation"
import { formatGasToString } from "../utils/gas"
import { formatSlippageToString } from "../utils/slippage"
import { isHighPriceImpact } from "../utils/priceImpact"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

interface Props {
  onClose: () => void
  onConfirm: () => void
  transactionData: DepositTransaction
}

function ReviewDeposit({
  onClose,
  onConfirm,
  transactionData,
}: Props): ReactElement {
  const { t } = useTranslation()
  const {
    slippageCustom,
    slippageSelected,
    gasPriceSelected,
    gasCustom,
    transactionDeadlineSelected,
    transactionDeadlineCustom,
  } = useSelector((state: AppState) => state.user)
  const { gasStandard, gasFast, gasInstant } = useSelector(
    (state: AppState) => state.application,
  )
  const [hasConfirmedHighPriceImpact, setHasConfirmedHighPriceImpact] =
    useState(false)
  const isHighPriceImpactTxn = isHighPriceImpact(transactionData.priceImpact)
  const deadline = formatDeadlineToNumber(
    transactionDeadlineSelected,
    transactionDeadlineCustom,
  )
  const shouldDisplayGas = !!gasStandard

  const DepositeInfoItem = styled(Box)(({ theme }) => ({
    display: "flex",
    minWidth: "65%",
    marginBottom: theme.spacing(2),
    "&>:first-child": {
      display: "flex",
      width: "60%",
    },
  }))

  return (
    <React.Fragment>
      <DialogTitle variant="h2">{t("reviewDeposit")}</DialogTitle>
      <DialogContent>
        <Box>
          <Typography variant="h3" mb={2}>
            {t("depositing")}
          </Typography>
          <Box>
            {transactionData.from.items.map(({ token, amount }) => (
              <DepositeInfoItem key={token.name}>
                <div>
                  <img src={token.icon} width={24} height={24} alt="icon" />
                  <Typography ml={1}>{token.symbol}</Typography>
                </div>
                <Typography>
                  {commify(formatBNToString(amount, token.decimals))}
                </Typography>
              </DepositeInfoItem>
            ))}
            <DepositeInfoItem>
              <Typography variant="subtitle1">{t("total")}</Typography>
              <Typography variant="subtitle1">
                {commify(
                  formatBNToString(transactionData.from.totalAmount, 18),
                )}
              </Typography>
            </DepositeInfoItem>
          </Box>
          <Divider />
          <Typography variant="h3" my={2}>
            {t("receiving")}
          </Typography>
          <DepositeInfoItem>
            <div>
              <img
                src={transactionData.to.item.token.icon}
                width={24}
                height={24}
                alt="icon"
              />
              <Typography>{transactionData.to.item.token.symbol}</Typography>
            </div>
            <Typography>
              {commify(
                formatBNToString(
                  transactionData.to.item.amount,
                  transactionData.to.item.token.decimals,
                ),
              )}
            </Typography>
          </DepositeInfoItem>
          <Divider />
          <DepositeInfoItem mt={2}>
            <Typography>{t("shareOfPool")}</Typography>
            <Typography>
              {formatBNToPercentString(transactionData.shareOfPool, 18)}
            </Typography>
          </DepositeInfoItem>
          {shouldDisplayGas && (
            <DepositeInfoItem>
              <Typography>{t("gas")}</Typography>
              <Typography>
                {formatGasToString(
                  { gasStandard, gasFast, gasInstant },
                  gasPriceSelected,
                  gasCustom,
                )}{" "}
                GWEI
              </Typography>
            </DepositeInfoItem>
          )}
          {/* TODO: Create a light API to expose the cached BlockNative gas estimates. */}
          {/* {transactionData.txnGasCost?.valueUSD && (
          <div className="depositInfoItem">
            <span className="label">{t("estimatedTxCost")}</span>
            <span className="value">
              {`≈$${commify(
                formatBNToString(transactionData.txnGasCost.valueUSD, 2, 2),
              )}`}
            </span>
          </div>
        )} */}
          <DepositeInfoItem>
            <Typography>{t("maxSlippage")}</Typography>
            <Typography>
              {formatSlippageToString(slippageSelected, slippageCustom)}%
            </Typography>
          </DepositeInfoItem>
          <DepositeInfoItem>
            <Typography>{t("deadline")}</Typography>
            <Typography>
              {deadline} {t("minutes")}
            </Typography>
          </DepositeInfoItem>
          <DepositeInfoItem>
            <Typography>{t("rates")}</Typography>
            <div>
              {transactionData.from.items.map(
                ({ token, singleTokenPriceUSD }) => (
                  <Typography key={token.symbol}>
                    1 {token.symbol} = $
                    {commify(formatBNToString(singleTokenPriceUSD, 18, 2))}
                  </Typography>
                ),
              )}
              {[transactionData.to.item].map(
                ({ token, singleTokenPriceUSD }) => (
                  <Typography key={token.symbol}>
                    1 {token.symbol} = $
                    {commify(formatBNToString(singleTokenPriceUSD, 18, 2))}
                  </Typography>
                ),
              )}
            </div>
          </DepositeInfoItem>
        </Box>
        {isHighPriceImpactTxn && (
          <HighPriceImpactConfirmation
            checked={hasConfirmedHighPriceImpact}
            onCheck={(): void =>
              setHasConfirmedHighPriceImpact((prevState) => !prevState)
            }
          />
        )}
        <Typography>{t("estimatedOutput")}</Typography>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onConfirm}
          disabled={isHighPriceImpactTxn && !hasConfirmedHighPriceImpact}
        >
          {t("confirmDeposit")}
        </Button>
        <Button variant="outlined" size="large" onClick={onClose}>
          {t("cancel")}
        </Button>
      </DialogActions>
    </React.Fragment>
  )
}

export default ReviewDeposit
