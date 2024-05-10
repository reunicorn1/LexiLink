# Manifest file: site.pp

# Define variables
$project_root = '/home/ubuntu/LexiLink'
$venv_dir = "${project_root}/venv"
$frontend_dir = "${project_root}/lexi-app"
$frontend_build_dir = "${frontend_dir}/dist"
$nginx_config_dir = '/etc/nginx/sites-available'
$nginx_site_name = 'lexilink'

# Install required packages
package { ['nginx', 'mysql-client', 'python3', 'python3-pip']:
  ensure => installed,
}

# Set up virtual environment
exec { 'create_virtualenv':
  command => "/usr/bin/python3 -m venv ${venv_dir}",
  creates => $venv_dir,
}

# Set up Flask backend
exec { 'install_backend_dependencies':
  command => "${venv_dir}/bin/pip install -r ${project_root}/requirements.txt",
  require => Exec['create_virtualenv'],
}

# Configure Nginx
file { "${nginx_config_dir}/${nginx_site_name}":
  ensure  => present,
  content => template("${project_root}/nginx.conf.erb"),
  notify  => Service['nginx'],
}

file { '/etc/nginx/sites-enabled/default':
  ensure => 'absent',
}

# Set up database
exec { 'setup_database':
  command => "cat ${project_root}/sql_utils/lexilink_dev_db.sql | mysql",
  require => Package['mysql-client'],
}

# Create mentors
exec { 'create_mentors':
  command => "python3 ${project_root}/create_n_mentors.py",
  require => Exec['setup_database'],
}

# Create students
exec { 'create_students':
  command => "python3 ${project_root}/create_n_students.py",
  require => Exec['setup_database'],
}

# Manage frontend
exec { 'build_frontend':
  command => "cd ${frontend_dir} && ${venv_dir}/bin/vite build",
  require => Exec['install_backend_dependencies'],
}

# Start Nginx
service { 'nginx':
  ensure  => running,
  enable  => true,
  require => File["${nginx_config_dir}/${nginx_site_name}"],
}

