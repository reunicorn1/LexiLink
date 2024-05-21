"""Modified bio length

Revision ID: b8ef1c000d4f
Revises: 
Create Date: 2024-05-21 13:03:42.756186

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'b8ef1c000d4f'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Payment_Model')
    op.drop_table('Student_Favorite_Mentors')
    with op.batch_alter_table('Session_Model', schema=None) as batch_op:
        batch_op.drop_index('payment_id')

    op.drop_table('Session_Model')
    with op.batch_alter_table('Mentor_Model', schema=None) as batch_op:
        batch_op.drop_index('ix_Mentor_Model_email')
        batch_op.drop_index('username')

    op.drop_table('Mentor_Model')
    op.drop_table('BlockList_Model')
    op.drop_table('Student_Mentors')
    op.drop_table('Review_Model')
    with op.batch_alter_table('Student_Model', schema=None) as batch_op:
        batch_op.drop_index('ix_Student_Model_email')
        batch_op.drop_index('username')

    op.drop_table('Student_Model')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('Student_Model',
    sa.Column('email', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('password', mysql.VARCHAR(length=500), nullable=False),
    sa.Column('username', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('first_name', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('last_name', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('country', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('nationality', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('first_language', mysql.ENUM('English', 'Mandarin Chinese', 'Hindi', 'Spanish', 'French', 'Standard Arabic', 'Bengali', 'Portuguese', 'Russian', 'Urdu', 'Indonesian', 'Standard German', 'Japanese', 'Nigerian Pidgin', 'Egyptian Spoken Arabic', 'Marathi', 'Telugu', 'Turkish', 'Tamil', 'Yue Chinese'), nullable=False),
    sa.Column('other_languages', mysql.JSON(), nullable=True),
    sa.Column('profile_picture', mysql.VARCHAR(length=128), nullable=True),
    sa.Column('is_verified', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False),
    sa.Column('id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('created_at', mysql.DATETIME(), nullable=False),
    sa.Column('updated_at', mysql.DATETIME(), nullable=False),
    sa.Column('proficiency', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('completed_lessons', mysql.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('role', mysql.VARCHAR(length=10), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('Student_Model', schema=None) as batch_op:
        batch_op.create_index('username', ['username'], unique=True)
        batch_op.create_index('ix_Student_Model_email', ['email'], unique=True)

    op.create_table('Review_Model',
    sa.Column('id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('created_at', mysql.DATETIME(), nullable=False),
    sa.Column('updated_at', mysql.DATETIME(), nullable=False),
    sa.Column('mentor_id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('student_id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('review_score', mysql.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('description', mysql.VARCHAR(length=3000), nullable=False),
    sa.ForeignKeyConstraint(['mentor_id'], ['Mentor_Model.id'], name='Review_Model_ibfk_1'),
    sa.ForeignKeyConstraint(['student_id'], ['Student_Model.id'], name='Review_Model_ibfk_2'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('Student_Mentors',
    sa.Column('student_id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('mentor_id', mysql.VARCHAR(length=60), nullable=False),
    sa.ForeignKeyConstraint(['mentor_id'], ['Mentor_Model.id'], name='Student_Mentors_ibfk_2'),
    sa.ForeignKeyConstraint(['student_id'], ['Student_Model.id'], name='Student_Mentors_ibfk_1'),
    sa.PrimaryKeyConstraint('student_id', 'mentor_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('BlockList_Model',
    sa.Column('id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('created_at', mysql.DATETIME(), nullable=False),
    sa.Column('updated_at', mysql.DATETIME(), nullable=False),
    sa.Column('jwt', mysql.VARCHAR(length=1000), nullable=False),
    sa.Column('type', mysql.VARCHAR(length=1000), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('Mentor_Model',
    sa.Column('email', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('password', mysql.VARCHAR(length=500), nullable=False),
    sa.Column('username', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('first_name', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('last_name', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('country', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('nationality', mysql.VARCHAR(length=128), nullable=False),
    sa.Column('first_language', mysql.ENUM('English', 'Mandarin Chinese', 'Hindi', 'Spanish', 'French', 'Standard Arabic', 'Bengali', 'Portuguese', 'Russian', 'Urdu', 'Indonesian', 'Standard German', 'Japanese', 'Nigerian Pidgin', 'Egyptian Spoken Arabic', 'Marathi', 'Telugu', 'Turkish', 'Tamil', 'Yue Chinese'), nullable=False),
    sa.Column('other_languages', mysql.JSON(), nullable=True),
    sa.Column('profile_picture', mysql.VARCHAR(length=128), nullable=True),
    sa.Column('is_verified', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False),
    sa.Column('id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('created_at', mysql.DATETIME(), nullable=False),
    sa.Column('updated_at', mysql.DATETIME(), nullable=False),
    sa.Column('expertise', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('bio', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('type', mysql.ENUM('Community', 'Professional'), nullable=False),
    sa.Column('price_per_hour', mysql.DECIMAL(precision=10, scale=2), nullable=True),
    sa.Column('availability', mysql.JSON(), nullable=True),
    sa.Column('demo_video', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('role', mysql.VARCHAR(length=10), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('Mentor_Model', schema=None) as batch_op:
        batch_op.create_index('username', ['username'], unique=True)
        batch_op.create_index('ix_Mentor_Model_email', ['email'], unique=True)

    op.create_table('Session_Model',
    sa.Column('id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('created_at', mysql.DATETIME(), nullable=False),
    sa.Column('updated_at', mysql.DATETIME(), nullable=False),
    sa.Column('mentor_id', mysql.VARCHAR(length=60), nullable=True),
    sa.Column('student_id', mysql.VARCHAR(length=60), nullable=True),
    sa.Column('payment_id', mysql.VARCHAR(length=60), nullable=True),
    sa.Column('date', mysql.DATETIME(), nullable=False),
    sa.Column('time', mysql.TIME(), nullable=False),
    sa.Column('duration', mysql.TIME(), nullable=False),
    sa.Column('status', mysql.ENUM('Pending', 'Approved', 'Declined', 'Completed', 'Cancelled'), nullable=False),
    sa.Column('mentor_token', mysql.VARCHAR(length=255), nullable=True),
    sa.Column('student_token', mysql.VARCHAR(length=255), nullable=True),
    sa.ForeignKeyConstraint(['mentor_id'], ['Mentor_Model.id'], name='Session_Model_ibfk_1'),
    sa.ForeignKeyConstraint(['payment_id'], ['Payment_Model.id'], name='Session_Model_ibfk_3'),
    sa.ForeignKeyConstraint(['student_id'], ['Student_Model.id'], name='Session_Model_ibfk_2'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    with op.batch_alter_table('Session_Model', schema=None) as batch_op:
        batch_op.create_index('payment_id', ['payment_id'], unique=True)

    op.create_table('Student_Favorite_Mentors',
    sa.Column('student_id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('mentor_id', mysql.VARCHAR(length=60), nullable=False),
    sa.ForeignKeyConstraint(['mentor_id'], ['Mentor_Model.id'], name='Student_Favorite_Mentors_ibfk_2'),
    sa.ForeignKeyConstraint(['student_id'], ['Student_Model.id'], name='Student_Favorite_Mentors_ibfk_1'),
    sa.PrimaryKeyConstraint('student_id', 'mentor_id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_table('Payment_Model',
    sa.Column('id', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('created_at', mysql.DATETIME(), nullable=False),
    sa.Column('updated_at', mysql.DATETIME(), nullable=False),
    sa.Column('mentor_id', mysql.VARCHAR(length=60), nullable=True),
    sa.Column('student_id', mysql.VARCHAR(length=60), nullable=True),
    sa.Column('date', mysql.DATETIME(), nullable=False),
    sa.Column('amount', mysql.DECIMAL(precision=10, scale=2), nullable=False),
    sa.Column('method', mysql.VARCHAR(length=60), nullable=False),
    sa.Column('status', mysql.ENUM('Pending', 'Approved', 'Declined', 'Completed'), nullable=False),
    sa.ForeignKeyConstraint(['mentor_id'], ['Mentor_Model.id'], name='Payment_Model_ibfk_1'),
    sa.ForeignKeyConstraint(['student_id'], ['Student_Model.id'], name='Payment_Model_ibfk_2'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    # ### end Alembic commands ###
