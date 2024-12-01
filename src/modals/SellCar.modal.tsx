import { Icon24CheckCircleFillGreen, Icon28CarOutline } from "@vkontakte/icons"
import { Button, ButtonGroup, ModalCard, Spacing } from "@vkontakte/vkui"
import React, { useEffect, useState } from "react"

const headerTextPull = [
    "Это ужасно, никогда больше не куплю!",
    "Полный отстой, трата денег",
    "Ужасное качество, обман",
    "Крайне недоволен, не рекомендую никому",
    "Чистой воды развод",
    "Очень разочарован, не стоит своих денег",
    "Отвратительный товар, не покупайте здесь"
];
const okTextPull = [
    "Это карма, братан",
    "Уходите, а то царап!",
    "Все будет, но не сегодня",
    "Повезет в следующий раз",
    "Это норма!",
    "Ошибки делают вас сильнее",
    "Успех требует жертв",
    "Держитесь там, счастья, удачи",
    "Это везение для одного из нас",
    "Не падайте духом, только убрался",
    "Ошибка - шаг к успеху",
];

export const SellCarModal = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    const [okText, setOkText] = useState<string>('Отлично');
    const [headerText, setHeaderText] = useState<string>('Отлично');
    
    useEffect(() => {
        const okText = okTextPull[Math.floor(okTextPull.length * Math.random())];
        setOkText(okText);

        const headerTextGen = headerTextPull[Math.floor(headerTextPull.length * Math.random())];
        setHeaderText(headerTextGen);
    }, [])

    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon28CarOutline />}
            header="Продано или потрачено! Отзыв покупателя:"
            subheader={headerText}
            actions={
                <React.Fragment>
                    <Spacing size={16} />
                    <ButtonGroup mode="vertical" gap="s" stretched>
                        <Button before={<Icon24CheckCircleFillGreen />} size="l" mode="primary" stretched
                            onClick={() => setCurrentModal(null)}
                        >
                            {okText}
                        </Button>
                    </ButtonGroup>
                </React.Fragment>
            }
        />
    )
}