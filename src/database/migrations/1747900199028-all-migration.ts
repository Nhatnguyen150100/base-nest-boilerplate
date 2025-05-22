import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllMigration1747900199028 implements MigrationInterface {
  name = 'AllMigration1747900199028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`avatar\` varchar(255) NULL, \`address\` varchar(255) NULL, \`phone_number\` varchar(255) NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'USER') NOT NULL DEFAULT 'USER', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
