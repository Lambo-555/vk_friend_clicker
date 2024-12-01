// import { ModalRoot, ModalPage, ModalCard, SplitLayout } from "@vkontakte/vkui";

import { Icon24CancelCircleFillRed, Icon24ChainOutline, Icon24CheckCircleFillGreen, Icon24PawOutline, Icon56DeleteOutlineIos, Icon56GavelOutline, Icon56StopwatchOutline, Icon56Users3Outline, Icon56WrenchOutline } from "@vkontakte/icons";
import { Spacing, ButtonGroup, Button, ModalCard } from "@vkontakte/vkui";
import React from "react";
import { DEFAULT_MODALS } from "../routes";

export const WelcomeOnboarding = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon56GavelOutline />}
            header="О чем игра?"
            subheader="Тут надо крушить и ломать авто на запчасти!"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button before={<Icon24CheckCircleFillGreen />} size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.DAMAGE_2)}>
                            То что надо
                        </Button>
                        <Button before={<Icon24CancelCircleFillRed />} onClick={() => setCurrentModal(null)} size="l" mode="secondary" stretched>
                            Не, ухожу
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const DamageOnboarding = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon56WrenchOutline />}
            header="Как провигаться?"
            subheader="Выбирай авто из своего списка машин и активно тапай"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button before={<Icon24CheckCircleFillGreen />} size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.BUY_3)}>
                            Неплохо
                        </Button>
                        <Button before={<Icon24CancelCircleFillRed />} onClick={() => setCurrentModal(null)} size="l" mode="secondary" stretched>
                            Уйти
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const BuyOnboarding = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon56DeleteOutlineIos />}
            header="А если я все сломаю?"
            subheader="В этом суть! Покупай хлам за 💎 и ломай его для большей прибыли"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button before={<Icon24CheckCircleFillGreen />} size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.INVITE_4)}>
                            Круть
                        </Button>
                        <Button before={<Icon24CancelCircleFillRed />} onClick={() => setCurrentModal(null)} size="l" mode="secondary" stretched>
                            Выйти
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const InviteOnboarding = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon56Users3Outline />}
            header="А вдруг мои лапки устанут?"
            subheader="Приглашай друзей в игру и получай приятный бонус"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button before={<Icon24CheckCircleFillGreen />} size="l" mode="primary" stretched onClick={() => setCurrentModal(DEFAULT_MODALS.ADS_5)}>
                            Бонусы? Ок, далее...
                        </Button>
                        <Button before={<Icon24CancelCircleFillRed />} onClick={() => setCurrentModal(null)} size="l" mode="secondary" stretched>
                            Позже
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}

export const AdsOnboarding = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}
            icon={<Icon56StopwatchOutline />}
            header="Что делать если я лев-тигр нет друзей?"
            subheader="Смотри рекламу, получай бонус и ищи друзей в нашем сообществе!"
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button before={<Icon24ChainOutline />} mode='link' href='https://vk.com/tapoLom' size="l" stretched>
                            Прыгнуть в сообщество!
                        </Button>
                        <Button before={<Icon24PawOutline />} onClick={() => setCurrentModal(null)} size="l" mode="primary" stretched>
                            Нажать лапкой и уйти
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}