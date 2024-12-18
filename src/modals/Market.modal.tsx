import { Icon24Dismiss, Icon56MoneyTransferOutline, Icon56NotificationOutline } from "@vkontakte/icons";
import { usePlatform, useAdaptivityConditionalRender, ModalPage, ModalPageHeader, PanelHeaderClose, PanelHeaderButton, Group, CellButton, Placeholder, useAdaptivityWithJSMediaQueries, Gradient, Avatar, Header, SimpleCell, ModalRoot, PanelHeaderSubmit, FormItem, SelectMimicry, Radio, Checkbox, Input, PanelHeaderBack, FormLayoutGroup, Cell, InfoRow, ModalCard, Spacing, Button, Textarea, ButtonGroup, UsersStack, SplitLayout, SplitCol, View, Panel, PanelHeader } from "@vkontakte/vkui";
import React, { useState } from "react";

const MODAL_PAGE_FILTERS = 'filters';
const MODAL_PAGE_COUNTRIES = 'countries';
const MODAL_PAGE_STORY_FEEDBACK = 'story-feedback';
const MODAL_PAGE_USER_INFO = 'user-info';
const MODAL_PAGE_FULLSCREEN = 'fullscreen';
const MODAL_PAGE_WITH_FIXED_HEIGHT = 'fixed-height';
const MODAL_PAGE_DYNAMIC = 'dynamic';

const MODAL_CARD_MONEY_SEND = 'money-send';
const MODAL_CARD_APP_TO_MENU = 'app-to-menu';
const MODAL_CARD_ABOUT = 'say-about';
const MODAL_CARD_NOTIFICATIONS = 'notifications';
const MODAL_CARD_CHAT_INVITE = 'chat-invite';

const DynamicModalPage = ({ updateModalHeight, onClose, ...props }: any) => {
    const platform = usePlatform();
    const { sizeX } = useAdaptivityConditionalRender();
    const [expanded, setExpanded] = React.useState(false);
    const toggle = React.useCallback(() => setExpanded(!expanded), [expanded]);

    return (
        <ModalPage
            {...props}
            header={
                <ModalPageHeader
                    before={
                        sizeX.compact &&
                        platform === 'android' && (
                            <PanelHeaderClose className={sizeX.compact.className} onClick={onClose} />
                        )
                    }
                    after={
                        sizeX.compact &&
                        platform === 'ios' && (
                            <PanelHeaderButton className={sizeX.compact.className} onClick={onClose}>
                                <Icon24Dismiss />
                            </PanelHeaderButton>
                        )
                    }
                >
                    Dynamic modal
                </ModalPageHeader>
            }
        >
            <Group>
                <CellButton onClick={toggle}>{expanded ? 'collapse' : 'expand'}</CellButton>
                {expanded && <Placeholder icon={<Icon56MoneyTransferOutline />} />}
            </Group>
        </ModalPage>
    );
};

export const MarketModalPage = () => {
    const { sizeX } = useAdaptivityConditionalRender();
    const { isDesktop } = useAdaptivityWithJSMediaQueries();
    const [activeModal, setActiveModal] = useState(null);
    const [modalHistory, setModalHistory] = useState<any>([]);
    const [randomUser] = useState<any>({});
    const [users] = useState(() =>
        'k'
            .repeat(25)
            .split('')
            .map(() => {}),
    );
    const platform = usePlatform();

    const changeActiveModal = (activeModal: any) => {
        activeModal = activeModal || null;
        let localModalHistory = modalHistory ? [...modalHistory] : [];

        if (activeModal === null) {
            localModalHistory = [];
        } else if (modalHistory?.includes(activeModal)) {
            localModalHistory = localModalHistory.splice(0, localModalHistory.indexOf(activeModal) + 1);
        } else {
            localModalHistory.push(activeModal);
        }

        setActiveModal(activeModal);
        setModalHistory(localModalHistory);
    };

    const modalBack = () => {
        changeActiveModal(modalHistory[modalHistory.length - 2]);
    };

    const randomUserFriends = (
        <React.Fragment>
            <Gradient mode="tint">
                <Placeholder
                    icon={<Avatar size={96} src={randomUser.photo_100} />}
                    header={randomUser.first_name + ' ' + randomUser.last_name}
                ></Placeholder>
            </Gradient>
            <Group
                header={
                    <Header mode="secondary" indicator="25">
                        Друзья
                    </Header>
                }
            >
                {users.map((user: any) => {
                    return (
                        <SimpleCell before={<Avatar src={user.photo_100} />} key={user.id}>
                            {user.name}
                        </SimpleCell>
                    );
                })}
            </Group>
        </React.Fragment>
    );

    const modal = (
        <ModalRoot activeModal={activeModal} onClose={modalBack}>
            <ModalPage
                id={MODAL_PAGE_FULLSCREEN}
                onClose={modalBack}
                settlingHeight={100}
                hideCloseButton={platform === 'ios'}
                header={
                    <ModalPageHeader
                        before={
                            sizeX.compact &&
                            platform === 'android' && (
                                <PanelHeaderClose className={sizeX.compact.className} onClick={modalBack} />
                            )
                        }
                        after={
                            platform === 'ios' && (
                                <PanelHeaderButton onClick={modalBack}>
                                    <Icon24Dismiss />
                                </PanelHeaderButton>
                            )
                        }
                    >
                        @{randomUser.screen_name}
                    </ModalPageHeader>
                }
            >
                {randomUserFriends}
            </ModalPage>

            <ModalPage
                id={MODAL_PAGE_WITH_FIXED_HEIGHT}
                onClose={modalBack}
                settlingHeight={100}
                height={isDesktop ? 250 : '70%'}
                hideCloseButton={platform === 'ios'}
                header={
                    <ModalPageHeader
                        before={
                            sizeX.compact &&
                            platform === 'android' && (
                                <PanelHeaderClose className={sizeX.compact.className} onClick={modalBack} />
                            )
                        }
                        after={
                            platform === 'ios' && (
                                <PanelHeaderButton onClick={modalBack}>
                                    <Icon24Dismiss />
                                </PanelHeaderButton>
                            )
                        }
                    >
                        @{randomUser.screen_name}
                    </ModalPageHeader>
                }
            >
                {randomUserFriends}
            </ModalPage>

            <DynamicModalPage id={MODAL_PAGE_DYNAMIC} onClose={modalBack} dynamicContentHeight />

            <ModalPage
                id={MODAL_PAGE_FILTERS}
                onClose={modalBack}
                header={
                    <ModalPageHeader
                        before={
                            sizeX.compact && (
                                <PanelHeaderClose className={sizeX.compact.className} onClick={modalBack} />
                            )
                        }
                        after={<PanelHeaderSubmit onClick={modalBack} />}
                    >
                        Фильтры
                    </ModalPageHeader>
                }
            >
                <Group>
                    <CellButton onClick={() => changeActiveModal(MODAL_PAGE_COUNTRIES)}>
                        Выбор страны
                    </CellButton>
                    <CellButton onClick={() => changeActiveModal(MODAL_PAGE_STORY_FEEDBACK)}>
                        Просмотры истории
                    </CellButton>
                    <CellButton onClick={() => changeActiveModal(MODAL_PAGE_USER_INFO)}>
                        Информация о пользователе
                    </CellButton>
                </Group>

                <Group>
                    <FormItem top="Страна">
                        <SelectMimicry
                            placeholder="Выбрать страну"
                            onClick={() => changeActiveModal(MODAL_PAGE_COUNTRIES)}
                        />
                    </FormItem>
                    <FormItem top="Город">
                        <SelectMimicry placeholder="Выбрать город" disabled />
                    </FormItem>
                </Group>

                <Group>
                    <FormItem top="Пол">
                        <Radio name="sex" value={0} defaultChecked>
                            Любой
                        </Radio>
                        <Radio name="sex" value={1}>
                            Мужской
                        </Radio>
                        <Radio name="sex" value={2}>
                            Женский
                        </Radio>
                    </FormItem>
                </Group>

                <Group>
                    <FormItem top="Школа">
                        <SelectMimicry placeholder="Выбрать школу" disabled />
                    </FormItem>
                    <FormItem top="Университет">
                        <SelectMimicry placeholder="Выбрать университет" disabled />
                    </FormItem>
                </Group>

                <Group>
                    <FormItem top="Дополнительно">
                        <Checkbox>С фотографией</Checkbox>
                        <Checkbox>Сейчас на сайте</Checkbox>
                    </FormItem>
                </Group>

                <Group>
                    <FormItem top="Работа">
                        <Input placeholder="Место работы" />
                    </FormItem>
                    <FormItem>
                        <Input placeholder="Должность" />
                    </FormItem>

                    <FormItem top="Дата рождения">
                        {/* <DatePicker
                            min={{ day: 1, month: 1, year: 1901 }}
                            max={{ day: 1, month: 1, year: 2006 }}
                            dayPlaceholder="Д"
                            monthPlaceholder="ММ"
                            yearPlaceholder="ГГ"
                        /> */}
                    </FormItem>
                </Group>
            </ModalPage>

            <ModalPage
                id={MODAL_PAGE_COUNTRIES}
                onClose={modalBack}
                header={
                    <ModalPageHeader before={<PanelHeaderBack label="Назад" onClick={modalBack} />}>
                        Выберите страну
                    </ModalPageHeader>
                }
                settlingHeight={80}
            >
                <Group>
                    <CellButton onClick={() => changeActiveModal(MODAL_PAGE_USER_INFO)}>
                        Информация о пользователе
                    </CellButton>

                    <FormLayoutGroup>
                        {[].map(({ id, title }) => {
                            return (
                                <Radio key={id} name="country" value={id}>
                                    {title}
                                </Radio>
                            );
                        })}
                    </FormLayoutGroup>
                </Group>
            </ModalPage>

            <ModalPage
                id={MODAL_PAGE_STORY_FEEDBACK}
                onClose={modalBack}
                header={
                    <ModalPageHeader before={<PanelHeaderBack label="Назад" onClick={modalBack} />}>
                        Просмотры истории
                    </ModalPageHeader>
                }
                settlingHeight={80}
            >
                <Group>
                    {users.map((user: any) => {
                        return (
                            <SimpleCell before={<Avatar src={user.photo_100} />} key={user.id}>
                                {user.name}
                            </SimpleCell>
                        );
                    })}
                </Group>
            </ModalPage>

            <ModalPage
                id={MODAL_PAGE_USER_INFO}
                onClose={modalBack}
                header={
                    <ModalPageHeader before={<PanelHeaderBack label="Назад" onClick={modalBack} />}>
                        Информация о пользователе
                    </ModalPageHeader>
                }
            >
                <Group>
                    <Cell>
                        <InfoRow header="Дата рождения">30 января 1993</InfoRow>
                    </Cell>
                    <Cell>
                        <InfoRow header="Родной город">Ереван</InfoRow>
                    </Cell>
                    <Cell>
                        <InfoRow header="Место работы">Команда ВКонтакте</InfoRow>
                    </Cell>
                </Group>
            </ModalPage>

            <ModalCard
                id={MODAL_CARD_MONEY_SEND}
                onClose={() => changeActiveModal(null)}
                icon={<Icon56MoneyTransferOutline />}
                header="Отправляйте деньги друзьям, используя банковскую карту"
                subheader="Номер карты получателя не нужен — он сам решит, куда зачислить средства."
                actions={
                    <React.Fragment>
                        <Spacing size={16} />
                        <Button
                            size="l"
                            mode="primary"
                            stretched
                            onClick={() => changeActiveModal(MODAL_CARD_APP_TO_MENU)}
                        >
                            Попробовать
                        </Button>
                    </React.Fragment>
                }
            />

            <ModalCard
                id={MODAL_CARD_APP_TO_MENU}
                onClose={() => changeActiveModal(null)}
                // icon={<Image borderRadius="l" src={getAvatarUrl('app_zagadki', 200)} size={72} />}
                header="Добавить игру «Загадки детства» в меню?"
                subheader="Игра появится под списком разделов на экране меню и будет всегда под рукой."
                actions={
                    <React.Fragment>
                        <Spacing size={16} />
                        <Button
                            size="l"
                            mode="primary"
                            stretched
                            onClick={() => changeActiveModal(MODAL_CARD_ABOUT)}
                        >
                            Добавить в меню
                        </Button>
                    </React.Fragment>
                }
            />

            <ModalCard
                id={MODAL_CARD_ABOUT}
                onClose={() => changeActiveModal(null)}
                header="Расскажите о себе"
                actions={
                    <Button
                        size="l"
                        mode="primary"
                        stretched
                        onClick={() => changeActiveModal(MODAL_CARD_NOTIFICATIONS)}
                    >
                        Сохранить
                    </Button>
                }
            >
                <Spacing size={16} />
                <Textarea defaultValue="В Грузии" />
            </ModalCard>

            <ModalCard
                id={MODAL_CARD_NOTIFICATIONS}
                onClose={() => changeActiveModal(null)}
                icon={<Icon56NotificationOutline />}
                header="Приложение запрашивает разрешение на отправку Вам уведомлений"
                actions={
                    <React.Fragment>
                        <Spacing size={16} />
                        <ButtonGroup gap="m" stretched>
                            <Button
                                key="deny"
                                size="l"
                                mode="secondary"
                                stretched
                                onClick={() => changeActiveModal(MODAL_CARD_CHAT_INVITE)}
                            >
                                Запретить
                            </Button>
                            <Button
                                key="allow"
                                size="l"
                                mode="primary"
                                stretched
                                onClick={() => changeActiveModal(MODAL_CARD_CHAT_INVITE)}
                            >
                                Разрешить
                            </Button>
                        </ButtonGroup>
                    </React.Fragment>
                }
            />

            <ModalCard
                id={MODAL_CARD_CHAT_INVITE}
                onClose={() => changeActiveModal(null)}
                // icon={<Avatar src={getAvatarUrl('chat_basketball', 200)} size={72} />}
                header="Баскетбол на выходных"
                subheader="Приглашение в беседу"
                actions={
                    <React.Fragment>
                        <Spacing size={8} />
                        <ButtonGroup gap="m" mode="vertical" stretched>
                            <Button
                                key="join"
                                size="l"
                                mode="primary"
                                stretched
                                onClick={() => changeActiveModal(null)}
                            >
                                Присоединиться
                            </Button>
                            <Button
                                key="copy"
                                size="l"
                                mode="secondary"
                                stretched
                                onClick={() => changeActiveModal(null)}
                            >
                                Скопировать приглашение
                            </Button>
                        </ButtonGroup>
                    </React.Fragment>
                }
            >
                <Spacing size={20} />
                <UsersStack
                    photos={[
                        // getAvatarUrl('user_mm'),
                        // getAvatarUrl('user_ilyagrshn'),
                        // getAvatarUrl('user_lihachyov'),
                        // getAvatarUrl('user_wayshev'),
                        // getAvatarUrl('user_arthurstam'),
                        // getAvatarUrl('user_xyz'),
                    ]}
                    size="l"
                    visibleCount={3}
                    direction="column"
                >
                    Алексей, Илья, Михаил
                    <br />и ещё 3 человека
                </UsersStack>
            </ModalCard>
        </ModalRoot>
    );

    return (
        <SplitLayout modal={modal}>
            <SplitCol>
                <View activePanel="modals">
                    <Panel id="modals">
                        <PanelHeader>Модальные окна</PanelHeader>
                        <Group>
                            <CellButton onClick={() => changeActiveModal(MODAL_PAGE_FILTERS)}>
                                Открыть модальную страницу
                            </CellButton>
                            <CellButton multiline onClick={() => changeActiveModal(MODAL_PAGE_FULLSCREEN)}>
                                Открыть полноэкранную модальную страницу
                            </CellButton>
                            <CellButton multiline onClick={() => changeActiveModal(MODAL_PAGE_WITH_FIXED_HEIGHT)}>
                                Открыть модальную страницу c фиксированной высотой
                            </CellButton>
                            <CellButton multiline onClick={() => changeActiveModal(MODAL_PAGE_DYNAMIC)}>
                                Открыть модальную страницу с динамической высотой
                            </CellButton>
                            <CellButton onClick={() => changeActiveModal(MODAL_CARD_MONEY_SEND)}>
                                Открыть модальные карточки
                            </CellButton>
                        </Group>
                    </Panel>
                </View>
            </SplitCol>
        </SplitLayout>
    );
};