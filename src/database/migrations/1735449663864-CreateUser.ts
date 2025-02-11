import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUserTable1678901234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('users');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'char',
              length: '36',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'uuid',
            },
            {
              name: 'fullName',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true,
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'role',
              type: 'enum',
              enum: ['USER', 'ADMIN'],
              default: `'USER'`,
            },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
            {
              name: 'updatedAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              onUpdate: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}