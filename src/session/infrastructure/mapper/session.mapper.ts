import { Session } from 'src/session/domain/session';
import { UserEntity } from 'src/users/infrastructure/entities/user.entity';
import { UserMapper } from 'src/users/infrastructure/mappers/user.mapper';
import { SessionEntity } from '../entities/session.entity';

export class SessionMapper {
  static toDomain(raw: SessionEntity): Session {
    const session = new Session();
    session.id = raw.id;

    if (raw.user) {
      session.user = UserMapper.toDomain(raw.user);
    }

    session.hash = raw.hash;
    session.createdAt = raw.createdAt;
    session.updatedAt = raw.updatedAt;
    session.createdAt = raw.createdAt;
    return session;
  }

  static toPersistence(session: Session): SessionEntity {
    const user = new UserEntity();
    user.id = Number(session.user.id);

    const sessionEntity = new SessionEntity();

    if (session.id && typeof session.id === 'number') {
      sessionEntity.id = session.id;
    }
    sessionEntity.hash = session.hash;
    sessionEntity.user = user;
    sessionEntity.createdAt = session.createdAt;
    sessionEntity.updatedAt = session.updatedAt;
    sessionEntity.deletedAt = session.deletedAt;
    return sessionEntity;
  }
}
