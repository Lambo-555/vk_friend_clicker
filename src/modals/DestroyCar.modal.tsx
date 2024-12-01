import { Icon24CheckCircleFillGreen, Icon28CarOutline } from "@vkontakte/icons"
import { Button, ButtonGroup, ModalCard, Spacing } from "@vkontakte/vkui"
import React, { useEffect, useState } from "react"

const headerTextPull = [
    "Экран стал чуть жирнее",
    "Вещица явно в хлам, пятничный",
    "Серверу поплохело, столько тапов",
    "Не видно, но экран чуть вогнут",
    "4млрд лет эволюции и вот это вот...",
    "Респект от разработчиков, молодец"
];

const okTextPull = [
    "Это я сделал!",
    "Выпустите победителя",
    "Что произойдет если нажать эту кнопку",
    "Я устал, я ухожу",
    "На что я трачу свою жизнь",
    "Надо бы молоток купить",
    "А в этом есть смысл",
    "Вы точно ВК-приложение?",
    "Лев-тигр стайл вин",
    "Тут тесно, помогите, где выход!",
    "Ну я же красавчик",
];

export const DestroyCarModal = ({ id, setCurrentModal }: { id: string, setCurrentModal: React.Dispatch<React.SetStateAction<any>> }) => {
    const [okText, setOkText] = useState<string>('Отлично');
    const [headerText, setHeaderText] = useState<string>('Отлично');
    
    useEffect(() => {
        const okText = okTextPull[Math.floor(okTextPull.length * Math.random())];
        setOkText(okText);

        const headerTextGen = headerTextPull[Math.floor(headerTextPull.length * Math.random())];
        setHeaderText(headerTextGen);
    }, [setCurrentModal])

    return (
        <ModalCard
            id={id}
            onClose={() => setCurrentModal(null)}

            icon={<Icon28CarOutline />}
            header="Неплохо потапано. Итоги:"
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