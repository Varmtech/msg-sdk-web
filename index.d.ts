export default Sceyt;

declare class Sceyt {
  chatClient: ChatClient;
  constructor(connectionTimeout?: number);
  get ConnectionListener(): typeof ConnectionListener;
  get ChannelListener(): typeof ChannelListener;
  get user(): User;
  addChannelListener: (uniqueListenerId: string, channelListener: ChannelListener) => void;
  removeChannelListener: (uniqueListenerId: string) => void;
  addConnectionListener: (uniqueListenerId: string, connectionListener: ConnectionListener) => void;
  removeConnectionListener: (uniqueListenerId: string) => void;
  connect: (jwt: string, resource: string) => Promise<string | {
    error: null;
  }>;
  disconnect: () => void;
}

declare class ChatClient {
  static instance: ChatClient;
  private reconnectInterval;
  private reconnectTimeout;
  channelListeners: ChannelListener;
  connectionListeners: ConnectionListener;
  consecutiveFailures: number;
  connectionStatus: string;
  user: User;
  constructor();
  static getInstance(): ChatClient;
  setOption: (key: string, value: number) => void;
  getTotalUnreads: () => Promise<unknown>;
  updateToken: (jwt: string) => Promise<unknown>;
  uploadFile: (file: File) => void;
  getRoles: () => Promise<string[]>;
  getUsers: (usersIds: string[]) => Promise<User[]>;
  get PublicChannel(): typeof PublicChannel;
  get PrivateChannel(): typeof PrivateChannel;
  get DirectChannel(): typeof DirectChannel;
  get ChannelQueryBuilder(): typeof ChannelQueryBuilder;
  get MembersQueryBuilder(): typeof MembersQueryBuilder;
  get BlockedMembersQueryBuilder(): typeof BlockedMembersQueryBuilder;
  get MessageListQueryBuilder(): typeof MessageQueryBuilder;
  get MessageByTypeListQueryBuilder(): typeof MessageByTypeQueryBuilder;
  get UserListQueryBuilder(): typeof UsersQueryBuilder;
  get BlockedChannelListQuery(): typeof BlockedQueryBuilder;
  get HiddenQueryBuilder(): typeof HiddenQueryBuilder;
}

interface ICreatePublicChannel {
  members: IMemberAction[];
  metadata: string;
  subject: string;
  avatarUrl: string;
  label: string;
  uri: string;
}
interface ICreatePrivateChannel {
  members: IMemberAction[];
  metadata: string;
  subject: string;
  avatarUrl: string;
  label: string;
}
interface ICreateDirectChannel {
  members: IMemberAction[];
  metadata: string;
  label: string;
}

interface IChannelConfig {
  uri: string;
  subject: string;
  metadata: string;
  avatar: string;
  label: string;
}

interface IMemberAction {
  role: string;
  id: string;
}

interface IChannelMethods {
  addMembers: (members: Member[]) => Promise<Member[]>;
  kickMembers: (members: Member[]) => Promise<Member[]>;
  delete: () => Promise<{
    deleted: boolean;
  }>;
}

export declare type IUploadProgress = (progressPercent: number) => void;
export declare type IUploadCompletion = (attachment: IAttachment, err: ISceytChatError) => void;
export declare type IMessageResponse = (message: Message) => void;

interface ISceytChatError {
  code: number;
  message: string;
}

interface IAttachment {
  fileSize?: number;
  data?: string;
  metadata?: string;
  name?: string;
  type: string;
  url: string;
  progress?: IUploadProgress;
  completion?: IUploadCompletion;
}

interface IMessageQuery {
  id: string;
  type: MessageQueryType;
  channelId: string;
  search: IMessageQuerySearch | null;
  messages: Message[];
}

interface IMessageQuerySearch {
  count?: number | null;
  direction?: MessageQueryDirection | null;
  complete: boolean;
  msgId?: number | null;
  timestamp?: number | null;
  messageType?: string | null;
}

interface IChannelListeners {
  [key: string]: ChannelListener;
}
interface IConnectionListeners {
  [key: string]: ConnectionListener;
}

interface IUserProfile {
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  metadata: string | null;
}

declare enum ChannelSearchQuerySortOptions {
  LAST_MESSAGE,
  CREATED_AT
}

declare enum ChannelOrder {
  LAST_MESSAGE = 0,
  CREATED_AT = 1
}

declare enum MarkChannel {
  AS_READ,
  AS_UNREAD,
}

declare enum ChannelSearchQueryKey {
  SUBJECT,
  URI,
  LABEL,
  USER
}

declare enum SearchQueryType {
  NONE,
  CONTAINS,
  BEGINS_WITH,
  EQUAL
}

declare enum ChannelType {
  NONE,
  PRIVATE,
  PUBLIC,
  DIRECT,
}

declare enum PresenceStatus {
  Offline,
  Online,
  Away,
  Dnd,
  Invisible
}

declare enum MessageUpdateStatus {
  NORMAL,
  EDIT,
  DELETE,
  COMPOSING,
  PAUSED
}

declare enum MessageDeliveryStatus {
  NONE,
  SERVER,
  DELIVERED,
  READ
}

declare enum MessageQueryDirection {
  NONE,
  NEXT,
  PREVIOUS,
  NEAR
}

declare enum MessageQueryType {
  SEARCH,
  UPDATE
}

declare enum UserAction {
  BLOCK,
  UNBLOCK,
  GET_BLOCK_LIST
}

declare enum UserSearchOrder {
  FIRST_NAME,
  LAST_NAME
}

declare enum MembersType {
  ALL,
  PRIVILEGED
}

declare enum MembersOrder {
  AFFILATION ,
  ASC ,
  DESC
}

declare enum MembersOrderKey {
  USERNAME ,
  FIRSTNAME ,
  LASTNAME
}

declare class QueryBuilder {
  count: number;
}

declare class Query {
  count: number;
  hasNext: boolean;
}

declare class UsersQueryBuilder extends QueryBuilder {
  type: MembersType;
  order: UserSearchOrder;
  searchQuery: string;
  i: number;
  hasNext: boolean;
  constructor();
  limit: (count: number) => this;
  query: (query: string) => this;
  orderByFirstname: () => this;
  orderByLastname: () => this;
  build: () => Promise<UsersQuery>;
}

declare class UsersQuery extends Query {
  order: UserSearchOrder;
  query: string;
  index: number;
  constructor(usersQueryBuilder: UsersQueryBuilder);
  loadNextPage: () => Promise<User[]>;
}

declare class ChannelQueryBuilder extends QueryBuilder {
  ctype: ChannelType;
  sort: ChannelSearchQuerySortOptions;
  hasNext: boolean;
  public: () => this;
  private: () => this;
  direct: () => this;
  limit: (count: number) => this;
  sortByLastMessage: () => this;
  sortByCreationDate: () => this;
  uriBeginsWith: (word: string) => this;
  uriEquals: (word: string) => this;
  uriContains: (word: string) => this;
  subjectBeginsWith: (word: string) => this;
  subjectEquals: (word: string) => this;
  subjectContains: (word: string) => this;
  userBeginsWith: (word: string) => this;
  userEquals: (word: string) => this;
  userContains: (word: string) => this;
  labelEquals: (word: string) => this;
  build: () => Promise<ChannelQuery>;
}

declare class ChannelQuery extends Query {
  ctype: ChannelType;
  fields: never[];
  sort: ChannelSearchQuerySortOptions;
  index: number;
  totalUnread?: number;
  constructor(queryBuilder: ChannelQueryBuilder);
  limit: (limit: number) => void;
  loadNextPage: () => Promise<{
    channels: (PrivateChannel | PublicChannel | DirectChannel)[];
    totalUnread: number;
    unreadChannels: number;
    hasNext: boolean;
  }>;
}

declare class HiddenQueryBuilder extends QueryBuilder {
  hasNext: boolean;
  limit: (count: number) => this;
  build: () => Promise<HiddenQuery>;
}
declare class HiddenQuery extends Query {
  index: number;
  constructor(queryBuilder: HiddenQueryBuilder);
  limit: (count: number) => void;
  loadNextPage: () => Promise<{
    channels: Channel;
    hasNext: boolean;
  }>;
}

declare class MembersQuery extends Query {
  channelId: string;
  type: MembersType;
  order: MembersOrder;
  key: MembersOrderKey;
  index: number;
  constructor(membersQueryBuilder: MembersQueryBuilder);
  limit: (limit: number) => void;
  loadNextPage: () => Promise<{
    members: Member[];
    hasNext: boolean;
  }>;
}

declare class MembersQueryBuilder extends QueryBuilder {
  channelId: string;
  type: MembersType;
  order: MembersOrder;
  key: MembersOrderKey;
  i: number;
  hasNext: boolean;
  constructor(channelPartialId: string);
  limit: (count: number) => this;
  privileged: () => this;
  all: () => this;
  byAscendingOrder: () => this;
  byDescendingOrder: () => this;
  byAffilationOrder: () => this;
  orderKeyByUsername: () => this;
  orderKeyByFirstname: () => this;
  orderKeyByLastname: () => this;
  build: () => Promise<MembersQuery>;
}
declare class BlockedMembersQueryBuilder extends QueryBuilder {
  channelId: string;
  i: number;
  hasNext: boolean;
  constructor(channelPartialId: string);
  limit: (count: number) => this;
  build: () => BlockedMembersQuery;
}
declare class BlockedMembersQuery extends Query {
  channelId: string;
  index: number;
  constructor(blockedMembersQueryBuilder: BlockedMembersQueryBuilder);
  loadNextPage: () => Promise<Member[]>;
}
declare class BlockedQueryBuilder extends QueryBuilder {
  i: number;
  hasNext: boolean;
  limit: (count: number) => this;
  build: () => Promise<BlockedQuery>;
}

declare class BlockedQuery extends Query {
  index: number;
  channels?: Channel[];
  constructor(queryBuilder: BlockedQueryBuilder);
  limit: (limit: number) => void;
  loadNextPage: () => Promise<never[] | this>;
}
declare class MessageQueryBuilder extends QueryBuilder {
  channelId: string;
  queryDirection: MessageQueryDirection;
  tmpStp?: number;
  msgId?: number;
  type: MessageQueryType;
  hasNext: boolean | null;
  msgType: string;
  constructor(channelPartialId: string);
  messageId: (msgId: number) => this;
  timestamp: (timestamp: number) => this;
  update: () => this;
  build: () => Promise<MessageQuery>;
}
declare class MessageQuery extends Query {
  channelId: string;
  queryDirection: MessageQueryDirection;
  timestamp?: number;
  messageId?: number;
  type: MessageQueryType;
  msgType?: string;
  reverseData: boolean;
  index: number;
  lastMessageId?: number | null;
  firstMessageId?: number | null;
  hasPrev: boolean;
  constructor(messageQueryBuilder: MessageQueryBuilder);
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => this;
  next: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  prev: () => Promise<{
    messages: {
      date: Date;
      to: string;
      status: number;
      from: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        presenceStatus: PresenceStatus;
        metadata: string | null;
        update: (profile: IUserProfile) => Promise<IUserProfile>;
      };
      isIncoming: boolean;
      text: string;
      tid?: number | undefined;
      id: number;
      type: string;
      metadata: string;
      chStatus: MessageUpdateStatus;
      attachments: IAttachment[];
    }[];
    complete: boolean | undefined;
  }>;
  near: () => Promise<{
    messages: {
      date: Date;
      to: string;
      status: number;
      from: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        presenceStatus: PresenceStatus;
        metadata: string | null;
        update: (profile: IUserProfile) => Promise<IUserProfile>;
      };
      isIncoming: boolean;
      text: string;
      tid?: number | undefined;
      id: number;
      type: string;
      metadata: string;
      chStatus: MessageUpdateStatus;
      attachments: IAttachment[];
    }[];
    complete: boolean | undefined;
  }>;
  nearMessageId: (messageId?: number | undefined) => Promise<{
    messages: {
      date: Date;
      to: string;
      status: number;
      from: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        presenceStatus: PresenceStatus;
        metadata: string | null;
        update: (profile: IUserProfile) => Promise<IUserProfile>;
      };
      isIncoming: boolean;
      text: string;
      tid?: number | undefined;
      id: number;
      type: string;
      metadata: string;
      chStatus: MessageUpdateStatus;
      attachments: IAttachment[];
    }[];
    complete: boolean | undefined;
  }>;
  nearTimestamp: (timeStamp?: number | undefined) => Promise<{
    messages: {
      date: Date;
      to: string;
      status: number;
      from: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        presenceStatus: PresenceStatus;
        metadata: string | null;
        update: (profile: IUserProfile) => Promise<IUserProfile>;
      };
      isIncoming: boolean;
      text: string;
      tid?: number | undefined;
      id: number;
      type: string;
      metadata: string;
      chStatus: MessageUpdateStatus;
      attachments: IAttachment[];
    }[];
    complete: boolean | undefined;
  }>;
}
declare class MessageBuilder {
  from: User;
  to: string;
  text: string;
  type: string;
  metadata: string;
  attachments: IAttachment[];
  tid: number;
  id: number;
  constructor(userId: string, channelId: string);
  setText: (text: string) => this;
  setMetadata: (metadata: string) => this;
  setType: (type: string) => this;
  setAttachments: (attachments: IAttachment[]) => this;
  create: () => Message;
}

declare class MessageByTypeQueryBuilder extends QueryBuilder {
  channelId: string;
  queryDirection: MessageQueryDirection;
  timestamp?: number;
  msgId?: number | null;
  type: MessageQueryType;
  hasNext: boolean | null;
  msgType: string;
  reverseData: boolean;
  constructor(channelPartialId: string);
  limit: (limit: number) => this;
  messageType: (type: string) => this;
  reverse: (isReverse: boolean) => void;
  build: () => Promise<MessageByTypeQuery>;
}
declare class MessageByTypeQuery extends Query {
  channelId: string;
  queryDirection: MessageQueryDirection;
  timestamp?: number;
  msgId?: number;
  type: MessageQueryType;
  msgType?: string;
  reverseData: boolean;
  constructor(messageByTypeQueryBuilder: MessageByTypeQueryBuilder);
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => void;
  loadNextPage: () => Promise<{
    messages: {
      date: Date;
      to: string;
      status: number;
      from: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        avatarUrl: string | null;
        presenceStatus: PresenceStatus;
        metadata: string | null;
        update: (profile: IUserProfile) => Promise<IUserProfile>;
      };
      isIncoming: boolean;
      text: string;
      tid?: number | undefined;
      id: number;
      type: string;
      metadata: string;
      chStatus: MessageUpdateStatus;
      attachments: IAttachment[];
    }[];
    complete: boolean | undefined;
  }>;
}
declare class ChannelListener {
  onMessageEdited: () => undefined;
  onMessageDeleted: () => undefined;
  onMessage: () => undefined;
  onLeave: () => undefined;
  onBlock: () => undefined;
  onUnBlock: () => undefined;
  onJoin: () => undefined;
  onCreate: () => undefined;
  onUpdate: () => undefined;
  onDelete: () => undefined;
  onMemberAdded: () => undefined;
  onMemberRemoved: () => undefined;
  onMemberBlocked: () => undefined;
  onMemberUnblocked: () => undefined;
  onStartTyping: () => undefined;
  onStopTyping: () => undefined;
  onUpdateDeliveryReceipt: () => undefined;
  onUpdateReadReceipt: () => undefined;
  onUpdateUnreadCounts: () => undefined;
  onHide: () => undefined;
  onUnhide: () => undefined;
  onChannelMarkedAsUnread: () => undefined;
  onClearHistory: () => undefined;
  onChangeRole: () => undefined;
  onOwnerChange: () => undefined;
}

declare class ConnectionListener {
  onReconnectStarted: () => undefined;
  onReconnectSucceeded: () => undefined;
  onReconnectFailed: () => undefined;
  onDisconnected: () => undefined;
  onTokenWillExpire: () => undefined;
  onTokenExpired: () => undefined;
}

declare class User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  presenceStatus: PresenceStatus;
  metadata: string | null;
  constructor();
  update: (profile: IUserProfile) => Promise<IUserProfile>;
}

declare class Member extends User {
  role: string | undefined;
  constructor();
}

declare class Message {
  from: User;
  to: string;
  text: string;
  date: Date | number;
  tid?: number;
  id: number;
  type: string;
  status: number;
  isIncoming: boolean;
  metadata: string;
  chStatus: MessageUpdateStatus;
  attachments: IAttachment[];
  constructor();
}

declare class Channel {
  lastMessage: Message | null;
  lastRead: number;
  lastDelivery: number;
  label: string;
  metadata: string;
  unreadCount: number;
  type: ChannelType;
  createdAt: Date | number;
  updatedAt: Date | number;
  id: string;
  isMarkedAsUnread: boolean;
  constructor();
  delete: () => Promise<void>;
  hide: () => Promise<boolean>;
  unhide: () => Promise<boolean>;
  clearHistory: () => Promise<{
    cleared: boolean;
  }>;
  update: (channelConfig: IChannelConfig, ) => Promise<PublicChannel | PrivateChannel | DirectChannel>;
  sendMessage: (message: Message, messageResponse: IMessageResponse, ) => Promise<unknown>;
  reSendMessage: (message: Message, messageResponse: IMessageResponse, ) => Promise<unknown>;
  createMessageBuilder: () => MessageBuilder;
  deleteMessage: (msgId: number, ) => Promise<Message>;
  editMessage: (msgId: number, body: string, ) => Promise<Message>;
  startTyping: () => Promise<unknown>;
  stopTyping: () => Promise<unknown>;
  markAllMessagesAsDelivered: () => void;
  markAllMessagesAsRead: () => void;
  markAsUnRead: () => Promise<unknown>;
}

declare class DirectChannel extends Channel {
  pear: Member;
  constructor();
  static create(channelData: ICreateDirectChannel): Promise<DirectChannel>;
}

declare class GroupChannel extends Channel {
  membersCount: number;
  subject: string;
  avatarUrl: string;
  myRole: string;
  constructor();
  addMembers: (members: IMemberAction[]) => Promise<Member[]>;
  kickMembers: (memberIds: string[], ) => Promise<Member[]>;
  blockMembers: (memberIds: string[], ) => Promise<Member[]>;
  unBlockMembers: (memberIds?: string[]) => Promise<Member[]>;
  block: () => Promise<boolean>;
  changeOwner: (newOwnerId: string) => Promise<Member[]>;
  changeMemberRole: (members: IMemberAction[], ) => Promise<Member[]>;
  unblock: () => Promise<boolean>;
  leave: () => Promise<void>;
}

declare class PrivateChannel extends GroupChannel {
  constructor();
  static create(channelData: ICreatePrivateChannel): Promise<PrivateChannel>;
}

declare class PublicChannel extends GroupChannel {
  uri: string;
  constructor();
  static create(channelData: ICreatePublicChannel): Promise<PublicChannel>;
  join: () => Promise<Member>;
}