// ----------- GENERAL ----------- \\

import { MdSpaceDashboard } from "react-icons/md";
export function IconDashboard({ className = null }) {
	return <MdSpaceDashboard className={className} />;
}

import { MdSettings } from "react-icons/md";
export function IconSettings({ className = null }) {
	return <MdSettings className={className} />;
}

import { MdOutlineKeyboardArrowRight } from "react-icons/md";
export function IconArrow({ className = null }) {
	return <MdOutlineKeyboardArrowRight className={className} />;
}

import { MdCheck } from "react-icons/md";
export function IconCheck({ className = null }) {
	return <MdCheck className={className} />;
}

import { MdClose } from "react-icons/md";
export function IconCross({ className = null }) {
	return <MdClose className={className} />;
}

import { MdOutlineArrowBack } from "react-icons/md";
export function IconBack({ className = null }) {
	return <MdOutlineArrowBack className={className} />;
}

// ----------- DEBTS ----------- \\
import { MdOutlineAttachMoney } from "react-icons/md";
export function IconDebt({ className = null }) {
	return <MdOutlineAttachMoney className={className} />;
}

import { MdAddBox } from "react-icons/md";
export function IconDebtCreate({ className = null }) {
	return <MdAddBox className={className} />;
}

// ----------- UNRECEIVED PAYMENTS ----------- \\
import { MdMoneyOff } from "react-icons/md";
export function IconUnreceieved({ className = null }) {
	return <MdMoneyOff className={className} />;
}

// ----------- SETTLEMENTS ----------- \\
import { FaHandshake } from "react-icons/fa";
export function IconSettlement({ className = null }) {
	return <FaHandshake className={className} />;
}

import { TiArrowForward } from "react-icons/ti";
export function IconSettlementCreate({ className = null }) {
	return <TiArrowForward className={className} />;
}

import { FaHandshakeSlash } from "react-icons/fa";
export function IconSettlementRejected({ className = null }) {
	return <FaHandshakeSlash className={className} />;
}

// ----------- PROFILE ----------- \\

import { BsPersonFill } from "react-icons/bs";
export function IconProfile({ className = null }) {
	return <BsPersonFill className={className} />;
}

// ----------- GROUP ----------- \\
import { MdGroups } from "react-icons/md";
export function IconGroup({ className = null }) {
	return <MdGroups className={className} />;
}
