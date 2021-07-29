export default Sceyt;

declare class Sceyt {
  chatClient: ChatClient;
  clientId: string;
  constructor(apiUrl: string, appId: string, clientId: string, connectionTimeout?: number);
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
  members: IMemberParams[];
  metadata?: string;
  subject: string;
  avatarUrl?: string;
  label?: string;
  uri: string;
}

interface ICreatePrivateChannel {
  members: IMemberParams[];
  metadata?: string;
  subject: string;
  avatarUrl?: string;
  label?: string;
}
interface ICreateDirectChannel {
  userId: string;
  metadata?: string;
  label?: string;
}

interface IChannelConfig {
  uri?: string;
  subject?: string;
  metadata?: string;
  avatar?: string;
  label?: string;
}

interface IMemberParams {
  role: string;
  id: string;
}

export declare type IUploadProgress = (progressPercent: number) => void;
export declare type IUploadCompletion = (attachment: Attachment, err: SceytChatError) => void;

interface IAttachmentParams {
  uploadedFileSize?: number;
  data?: File;
  metadata?: string;
  name?: string;
  type: string;
  url?: string;
  upload: boolean;
  progress?: IUploadProgress;
  completion?: IUploadCompletion;
}

interface IUserProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  metadata?: string;
}

declare class QueryBuilder {
  count: number;
}

declare class Query {
  count: number;
  hasNext: boolean;
}

declare class UsersQueryBuilder extends QueryBuilder {
  filter: string;
  order: string;
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
  build: () => UsersQuery;
}

interface UsersQuery extends Query {
  order: string;
  query: string;
  index: number;
  limit: (count: number) => this;
  loadNextPage: () => Promise<{ users: User[], hasNext: boolean }>;
}

declare class BlockedUsersQueryBuilder extends QueryBuilder {
  i: number;
  hasNext: boolean;
  constructor();
  limit: (count: number) => this;
  build: () => BlockedUsersQuery;
}

interface BlockedUsersQuery extends Query {
  index: number;
  limit: (count: number) => this;
  loadNextPage: () => Promise<{ users: User[], hasNext: boolean }>;
}

declare class ChannelQueryBuilder extends QueryBuilder {
  ctype: string;
  sort: string;
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
  build: () => ChannelQuery;
}

interface ChannelQuery extends Query {
  ctype: string;
  fields: never[];
  sort: string;
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
  build: () => HiddenQuery;
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
  type: 'All' | 'Privileged';
  order: 'Affilation' | 'Asc' | 'Desc';
  key: 'Username' | 'Firstname' | 'Lastname';
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
  build: () => MembersQuery;
}

interface MembersQuery extends Query {
  channelId: string;
  type: 'All' | 'Privileged';
  order: 'Affilation' | 'Asc' | 'Desc';
  key: 'Username' | 'Firstname' | 'Lastname';
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
  build: () => BlockedQuery;
}

interface BlockedQuery extends Query {
  index: number;
  channels?: Channel[];
  limit: (limit: number) => void;
  loadNextPage: () => Promise<never[] | this>;
}

declare class MessageQueryBuilder extends QueryBuilder {
  channelId: string;
  queryDirection: string;
  tmpStp?: number;
  msgId?: number;
  type: string;
  hasNext: boolean | null;
  msgType: string;
  constructor(channelPartialId: string);
  messageId: (msgId: number) => this;
  timestamp: (timestamp: number) => this;
  limit: (limit: number) => this;
  reverse: (isReverse: boolean) => this;
  searchInThread: () => this;
  update: () => this;
  build: () => MessageQuery;
}

interface MessageQuery extends Query {
  channelId: string;
  queryDirection: string;
  timestamp?: number;
  messageId?: number;
  type: string;
  msgType?: string;
  reverseData: boolean;
  index: number;
  lastMessageId?: number | null;
  firstMessageId?: number | null;
  hasPrev: boolean;
  limit: number;
  reverse: boolean;
  next: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  nextMessageId: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  nextTimestamp: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  prev: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  prevMessageId: () => Promise<{
    messages: Message[];
    complete: boolean | undefined;
  }>;
  prevTimestamp: () => Promise<{
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
  attachments: IAttachmentParams[];
  tid: number;
  parentMessageId: string;
  replyInThread: boolean;

  constructor(userId: string, channelId: string);
  setText: (text: string) => this;
  setMetadata: (metadata: string) => this;
  setType: (type: string) => this;
  setAttachments: (attachments: IAttachmentParams[]) => this;
  setMentionUserIds: (userIds: string[]) => this;
  setParentMessageId: (messageId: string) => this;
  setReplyInThread: () => this;
  create: () => Message;
}

declare class MessageByTypeQueryBuilder extends QueryBuilder {
  channelId: string;
  type: string;
  hasNext: boolean | null;
  msgType: string;
  reverseData: boolean;
  constructor(channelPartialId: string);
  limit: (limit: number) => this;
  messageType: (type: string) => this;
  reverse: (isReverse: boolean) => void;
  build: () => MessageByTypeQuery;
}

interface MessageByTypeQuery extends Query {
  channelId: string;
  type: string;
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
  onMessageEdited: (channel: Channel, user: User, message: Message) => void;
  onMessageDeleted: (channel: Channel, user: User, message: Message) => void;
  onReactionUpdated: (channel: Channel, reactionEvent: ReactionEvent) => void;
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
  presenceStatus: string;
  state: string;
  metadata: string | null;
  blocked: boolean
}

interface Member extends User {
  role: string;
}

interface Message {
  from: User;
  text: string;
  createdAt: Date | number;
  updatedAt: Date | number;
  tid?: number;
  id: string;
  type: string;
  status: 'None' | 'Server' | 'Delivered' | 'Read';
  isIncoming: boolean;
  metadata?: string;
  chStatus: 'Normal' | 'Edit' | 'Delete' | 'Composing' | 'Paused' | 'Reaction';
  selfReactions: Reaction[];
  lastReactions: Reaction[];
  reactionScores: { [key: string]: number } | null;
  attachments: Attachment[];
  mentionedUsers: User[];
  requestedMentionUserIds?: string[];
  parentMessage?: Message;
  replyInThread?: boolean;
}

interface Attachment {
  uploadedFileSize?: number;
  name: string;
  type: string;
  metadata?: string;
  url: string;
  upload: boolean
}

interface Reaction {
  key: string;
  score: number;
  reason: string;
  updatedAt: Date;
  createdAt: Date;
  messageId: number;
  user: User
}

interface ReactionEvent {
  type: string,
  from: User,
  reaction: Reaction,
  message: Message
}

interface Channel {
  lastMessage: Message | null;
  lastRead: number;
  lastDelivery: number;
  label?: string;
  metadata?: string;
  unreadCount: number;
  type: 'Public' | 'Private' | 'Direct';
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
  sendMessage: (message: Message ) => Promise<Message>;
  reSendMessage: (message: Message ) => Promise<Message>;
  createMessageBuilder: () => MessageBuilder;
  deleteMessage: (msgId: string ) => Promise<Message>;
  editMessage: (message) => Promise<Message>;
  startTyping: () => void;
  stopTyping: () => void;
  markAllMessagesAsDelivered: () => Promise<void>;
  markAllMessagesAsRead: () => Promise<void>;
  markAsUnRead: () => Promise<Channel>;
  mute: (muteExpireTime: number) => Promise<Channel>;
  unmute: () => Promise<Channel>;
  addReaction: (messageId: string, key: string, score: number, reason: string, enforceUnique: boolean) => Promise<{ message: Message, reaction: Reaction }>
  deleteReaction: (messageId: string, key: string) => Promise<{ message: Message, reaction: Reaction }>
}

interface GroupChannel extends Channel {
  membersCount: number;
  subject: string;
  avatarUrl?: string;
  myRole: string;
  addMembers: (members: IMemberParams[]) => Promise<Member[]>;
  kickMembers: (memberIds: string[], ) => Promise<Member[]>;
  blockMembers: (memberIds: string[], ) => Promise<Member[]>;
  unBlockMembers: (memberIds?: string[]) => Promise<Member[]>;
  block: () => Promise<boolean>;
  changeOwner: (newOwnerId: string) => Promise<Member[]>;
  changeMemberRole: (members: IMemberParams[], ) => Promise<Member[]>;
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