export default Sceyt;

declare class Sceyt {
  chatClient: ChatClient;
  clientId: string;
  constructor(apiUrl: string, clientId: string, connectionTimeout?: number);
  ConnectionListener(): ConnectionListener;
  ChannelListener(): ChannelListener;
  user: User;
  addChannelListener: (uniqueListenerId: string, channelListener: ChannelListener) => void;
  removeChannelListener: (uniqueListenerId: string) => void;
  addConnectionListener: (uniqueListenerId: string, connectionListener: ConnectionListener) => void;
  removeConnectionListener: (uniqueListenerId: string) => void;
  connect: (jwt: string) => Promise<void | SceytChatError>;
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
  getTotalUnreads: () => Promise<{ totalUnread: number, unreadChannels: number }>;
  updateToken: (jwt: string) => Promise<unknown>;
  uploadFile: (file: { data: File, progress: ()=> number }) => void;
  getRoles: () => Promise<string[]>;
  setProfile: (profile: IUserProfile) => Promise<IUserProfile>;
  getUsers: (usersIds: string[]) => Promise<User[]>;
  blockUsers: (usersIds: string[]) => Promise<User[]>;
  unblockUsers: (usersIds: string[]) => Promise<User[]>;
  PublicChannel: PublicChannel;
  PrivateChannel: PrivateChannel;
  DirectChannel: DirectChannel;
  ChannelQueryBuilder(): ChannelQueryBuilder;
  MembersQueryBuilder(channelId: string): MembersQueryBuilder;
  BlockedMembersQueryBuilder(): BlockedMembersQueryBuilder;
  MessageListQueryBuilder(channelId: string): MessageQueryBuilder;
  MessageByTypeListQueryBuilder(channelId: string): MessageByTypeQueryBuilder;
  UserListQueryBuilder(): UsersQueryBuilder;
  BlockedUserListQueryBuilder(): BlockedUsersQueryBuilder;
  BlockedChannelListQuery(): BlockedQueryBuilder;
  HiddenQueryBuilder(): HiddenQueryBuilder;
}

interface SceytChatError extends Error{
  message: string,
  code: number
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

export declare type IUploadProgress = (progressPercent: number) => void;
export declare type IUploadCompletion = (attachment: IAttachment, err: SceytChatError) => void;
export declare type IMessageResponse = (message: Message) => void;

interface IAttachment {
  uploadedFileSize?: number;
  data?: string;
  metadata?: string;
  name?: string;
  type: string;
  url: string;
  upload: boolean;
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
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  metadata?: string;
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
  LAST_NAME,
  USERNAME
}

export enum UserSearchFilter {
  BY_ALL,
  BY_FIRST_NAME,
  BY_LAST_NAME,
  BY_USERNAME
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
  filter: UserSearchFilter;
  order: UserSearchOrder;
  searchQuery: string;
  i: number;
  hasNext: boolean;
  constructor();
  limit: (count: number) => this;
  query: (query: string) => this;
  orderByFirstname: () => this;
  orderByLastname: () => this;
  orderByUsername: () => this;
  filterByAll: () => this;
  filterByFirstname: () => this;
  filterByLastname: () => this;
  filterByUsername: () => this;
  build: () => Promise<UsersQuery>;
}

interface UsersQuery extends Query {
  order: UserSearchOrder;
  query: string;
  index: number;
  limit: (count: number) => this;
  loadNextPage: () => Promise<{ users: User[], hasNext: boolean }>;
}

declare class BlockedUsersQueryBuilder extends QueryBuilder {
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
  build: () => Promise<BlockedUsersQuery>;
}

interface BlockedUsersQuery extends Query {
  order: UserSearchOrder;
  query: string;
  index: number;
  limit: (count: number) => this;
  loadNextPage: () => Promise<{ users: User[], hasNext: boolean }>;
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

interface ChannelQuery extends Query {
  ctype: ChannelType;
  fields: never[];
  sort: ChannelSearchQuerySortOptions;
  index: number;
  totalUnread?: number;
  limit: (limit: number) => this;
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

interface HiddenQuery extends Query {
  index: number;
  limit: (count: number) => void;
  loadNextPage: () => Promise<{
    channels: Channel;
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

interface MembersQuery extends Query {
  channelId: string;
  type: MembersType;
  order: MembersOrder;
  key: MembersOrderKey;
  index: number;
  limit: (limit: number) => void;
  loadNextPage: () => Promise<{
    members: Member[];
    hasNext: boolean;
  }>;
}

declare class BlockedMembersQueryBuilder extends QueryBuilder {
  channelId: string;
  i: number;
  hasNext: boolean;
  constructor(channelPartialId: string);
  limit: (count: number) => this;
  build: () => BlockedMembersQuery;
}

interface BlockedMembersQuery extends Query {
  channelId: string;
  index: number;
  loadNextPage: () => Promise<Member[]>;
}

declare class BlockedQueryBuilder extends QueryBuilder {
  i: number;
  hasNext: boolean;
  limit: (count: number) => this;
  constructor();
  build: () => Promise<BlockedQuery>;
}

interface BlockedQuery extends Query {
  index: number;
  channels?: Channel[];
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
interface MessageQuery extends Query {
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
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => this;
  next: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  prev: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  near: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  nearMessageId: (messageId: number) => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  nearTimestamp: (timeStamp: number) => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
}
declare class MessageBuilder {
  from: User;
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

interface MessageByTypeQuery extends Query {
  channelId: string;
  type: MessageQueryType;
  msgType?: string;
  reverseData: boolean;
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => void;
  loadNextPage: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
}

declare class ChannelListener {
  onMessageEdited: (channel: Channel, message: Message) => void;
  onMessageDeleted: (channel: Channel, message: Message) => void;
  onMessage: (channel: Channel, message: Message) => void;
  onLeave: (channel: Channel, member: Member) => void;
  onBlock: (channel: Channel) => void;
  onUnBlock: (channel: Channel) => void;
  onJoin: (channel: Channel, member: Member) => void;
  onCreate: (channel: Channel) => void;
  onUpdate: (channel: Channel) => void;
  onDelete: (channelId: string) => void;
  onMemberAdded: (channel: Channel, members: Member[]) => void;
  onMemberRemoved: (channel: Channel, members: Member[]) => void;
  onMemberBlocked: (channel: Channel, members: Member[]) => void;
  onMemberUnblocked: (channel: Channel, members: Member[]) => void;
  onStartTyping: (channel: Channel, member: Member) => void;
  onStopTyping: (channel: Channel, member: Member) => void;
  onUpdateDeliveryReceipt: (channel: Channel) => void;
  onUpdateReadReceipt: (channel: Channel) => void;
  onUpdateTotalUnreadCount: (channel: Channel, totalUnread: number, unreadChannels: number) => void;
  onHide: (channel: Channel) => void;
  onUnhide: (channel: Channel) => void;
  onMute: (channel: Channel) => void;
  onUnmute: (channel: Channel) => void;
  onMarkAsUnread: (channel: Channel) => void;
  onClearHistory: (channel: Channel) => void;
  onChangeRole: (channel: Channel, members: Member[]) => void;
  onOwnerChange: (channel: Channel, newOwner: Member, oldOwner: Member) => void;
}

declare class ConnectionListener {
  onTokenWillExpire: (timeInterval: number) => void;
  onTokenExpired: () => void;
  onChangeConnectStatus: (status: string) => void;
}

declare class User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  presenceStatus: PresenceStatus;
  metadata: string | null;
  blocked: boolean
}

interface Member extends User {
  role: string;
}

interface Message {
  from: User;
  text: string;
  date: Date | number;
  tid?: number;
  id: number;
  type: string;
  status: MessageDeliveryStatus;
  isIncoming: boolean;
  metadata: string;
  chStatus: MessageUpdateStatus;
  attachments: Attachment[];
}

interface Attachment {
  uploadedFileSize?: number;
  name: string;
  type: string;
  metadata?: string;
  url: string;
  upload: boolean
}

interface Channel {
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
  muted: boolean;
  muteExpireTime: Date | number;
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
  startTyping: () => Promise<Message>;
  stopTyping: () => Promise<Message>;
  markAllMessagesAsDelivered: () => void;
  markAllMessagesAsRead: () => void;
  markAsUnRead: () => Promise<Channel>;
  mute: (muteExpireTime: number) => Promise<Channel>;
  unmute: () => Promise<Channel>
}

interface GroupChannel extends Channel {
  membersCount: number;
  subject: string;
  avatarUrl: string;
  myRole: string;
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

interface DirectChannel extends Channel {
  peer: Member;
  create(channelData: ICreateDirectChannel): Promise<DirectChannel>;
}

interface PrivateChannel extends GroupChannel {
  create(channelData: ICreatePrivateChannel): Promise<PrivateChannel>;
}

interface PublicChannel extends GroupChannel {
  uri: string;
  create(channelData: ICreatePublicChannel): Promise<PublicChannel>;
  join: () => Promise<Member>;
}