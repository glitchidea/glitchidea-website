from flask import Flask, render_template, request, jsonify, redirect, url_for, flash
import json
import os
from datetime import datetime
import configparser

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'

# Config dosyası
CONFIG_FILE = 'config.ini'

def load_config():
    """Config dosyasını yükle"""
    config = configparser.ConfigParser()
    if os.path.exists(CONFIG_FILE):
        config.read(CONFIG_FILE)
        return config
    else:
        # Varsayılan config oluştur
        config['PATHS'] = {
            'data_path': '../data',
            'services_file': 'services.json',
            'projects_file': 'projects.json',
            'social_file': 'social.json',
            'blog_file': 'blog.json'
        }
        with open(CONFIG_FILE, 'w') as configfile:
            config.write(configfile)
        return config

def get_json_data(filename):
    """JSON dosyasını oku"""
    config = load_config()
    data_path = config.get('PATHS', 'data_path', fallback='../data')
    file_path = os.path.join(data_path, filename)
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}

def save_json_data(filename, data):
    """JSON dosyasına kaydet"""
    config = load_config()
    data_path = config.get('PATHS', 'data_path', fallback='../data')
    file_path = os.path.join(data_path, filename)
    
    # Dizin yoksa oluştur
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    """Ana sayfa"""
    return render_template('index.html')

@app.route('/settings')
def settings():
    """Ayarlar sayfası"""
    config = load_config()
    return render_template('settings.html', config=config)



@app.route('/services')
def services():
    """Hizmetler sayfası"""
    data = get_json_data('services.json')
    return render_template('services.html', data=data)

@app.route('/api/services', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_services():
    """Hizmetler API"""
    if request.method == 'GET':
        return jsonify(get_json_data('services.json'))
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            services_data = get_json_data('services.json')
            
            # Yeni ID oluştur
            new_id = max([s.get('id', 0) for s in services_data.get('services', [])], default=0) + 1
            data['id'] = new_id
            
            services_data.setdefault('services', []).append(data)
            save_json_data('services.json', services_data)
            
            return jsonify({'success': True, 'message': 'Hizmet eklendi!', 'id': new_id})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            service_id = data.get('id')
            services_data = get_json_data('services.json')
            
            for i, service in enumerate(services_data.get('services', [])):
                if service.get('id') == service_id:
                    services_data['services'][i] = data
                    save_json_data('services.json', services_data)
                    return jsonify({'success': True, 'message': 'Hizmet güncellendi!'})
            
            return jsonify({'success': False, 'message': 'Hizmet bulunamadı!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'DELETE':
        try:
            service_id = request.args.get('id', type=int)
            services_data = get_json_data('services.json')
            
            services_data['services'] = [
                s for s in services_data.get('services', []) 
                if s.get('id') != service_id
            ]
            save_json_data('services.json', services_data)
            
            return jsonify({'success': True, 'message': 'Hizmet silindi!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})

@app.route('/projects')
def projects():
    """Projeler sayfası"""
    data = get_json_data('projects.json')
    return render_template('projects.html', data=data)

@app.route('/api/projects', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_projects():
    """Projeler API"""
    if request.method == 'GET':
        return jsonify(get_json_data('projects.json'))
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            projects_data = get_json_data('projects.json')
            
            # Yeni ID oluştur
            new_id = max([p.get('id', 0) for p in projects_data.get('projects', [])], default=0) + 1
            data['id'] = new_id
            
            projects_data.setdefault('projects', []).append(data)
            save_json_data('projects.json', projects_data)
            
            return jsonify({'success': True, 'message': 'Proje eklendi!', 'id': new_id})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            project_id = data.get('id')
            projects_data = get_json_data('projects.json')
            
            for i, project in enumerate(projects_data.get('projects', [])):
                if str(project.get('id')) == str(project_id):
                    projects_data['projects'][i] = data
                    save_json_data('projects.json', projects_data)
                    return jsonify({'success': True, 'message': 'Proje güncellendi!'})
            
            return jsonify({'success': False, 'message': 'Proje bulunamadı!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'DELETE':
        try:
            project_id = request.args.get('id')
            projects_data = get_json_data('projects.json')
            
            # ID'yi string olarak karşılaştır
            projects_data['projects'] = [
                p for p in projects_data.get('projects', []) 
                if str(p.get('id')) != str(project_id)
            ]
            save_json_data('projects.json', projects_data)
            
            return jsonify({'success': True, 'message': 'Proje silindi!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})

@app.route('/social')
def social():
    """Sosyal medya sayfası"""
    data = get_json_data('social.json')
    return render_template('social.html', data=data)

@app.route('/api/social', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_social():
    """Sosyal medya API"""
    if request.method == 'GET':
        return jsonify(get_json_data('social.json'))
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            social_data = get_json_data('social.json')
            
            # Yeni ID oluştur - ID'leri integer'a çevir
            existing_ids = []
            for s in social_data.get('social_links', []):
                try:
                    existing_ids.append(int(s.get('id', 0)))
                except (ValueError, TypeError):
                    existing_ids.append(0)
            
            new_id = max(existing_ids, default=0) + 1
            data['id'] = new_id
            
            social_data.setdefault('social_links', []).append(data)
            save_json_data('social.json', social_data)
            
            return jsonify({'success': True, 'message': 'Sosyal medya eklendi!', 'id': new_id})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            social_id = data.get('id')
            social_data = get_json_data('social.json')
            
            for i, social in enumerate(social_data.get('social_links', [])):
                if str(social.get('id')) == str(social_id):
                    social_data['social_links'][i] = data
                    save_json_data('social.json', social_data)
                    return jsonify({'success': True, 'message': 'Sosyal medya güncellendi!'})
            
            return jsonify({'success': False, 'message': 'Sosyal medya bulunamadı!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'DELETE':
        try:
            social_id = request.args.get('id')
            social_data = get_json_data('social.json')
            
            # ID'yi string olarak karşılaştır
            social_data['social_links'] = [
                s for s in social_data.get('social_links', []) 
                if str(s.get('id')) != str(social_id)
            ]
            save_json_data('social.json', social_data)
            
            return jsonify({'success': True, 'message': 'Sosyal medya silindi!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})

@app.route('/blog')
def blog():
    """Blog sayfası"""
    data = get_json_data('blog.json')
    return render_template('blog.html', data=data)


@app.route('/api/blog', methods=['GET', 'POST', 'PUT', 'DELETE'])
def api_blog():
    """Blog API"""
    if request.method == 'GET':
        return jsonify(get_json_data('blog.json'))
    
    elif request.method == 'POST':
        try:
            data = request.get_json()
            blog_data = get_json_data('blog.json')
            
            # Yeni ID oluştur
            new_id = max([b.get('id', 0) for b in blog_data.get('posts', [])], default=0) + 1
            data['id'] = new_id
            data['date'] = datetime.now().strftime('%Y-%m-%d')
            
            blog_data.setdefault('posts', []).append(data)
            save_json_data('blog.json', blog_data)
            
            return jsonify({'success': True, 'message': 'Blog yazısı eklendi!', 'id': new_id})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'PUT':
        try:
            data = request.get_json()
            blog_id = data.get('id')
            blog_data = get_json_data('blog.json')
            
            for i, post in enumerate(blog_data.get('posts', [])):
                if str(post.get('id')) == str(blog_id):
                    blog_data['posts'][i] = data
                    save_json_data('blog.json', blog_data)
                    return jsonify({'success': True, 'message': 'Blog yazısı güncellendi!'})
            
            return jsonify({'success': False, 'message': 'Blog yazısı bulunamadı!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})
    
    elif request.method == 'DELETE':
        try:
            blog_id = request.args.get('id')
            blog_data = get_json_data('blog.json')
            
            blog_data['posts'] = [
                b for b in blog_data.get('posts', []) 
                if str(b.get('id')) != str(blog_id)
            ]
            save_json_data('blog.json', blog_data)
            
            return jsonify({'success': True, 'message': 'Blog yazısı silindi!'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'Hata: {str(e)}'})

@app.route('/api/save_config', methods=['POST'])
def save_config():
    try:
        data = request.get_json()
        
        # Update config.ini with new values
        config = configparser.ConfigParser()
        config.read('config.ini')
        
        # Ensure sections exist
        if 'PATHS' not in config:
            config.add_section('PATHS')
        if 'SECURITY' not in config:
            config.add_section('SECURITY')
        
        # Update paths
        for key in ['data_path', 'services_file', 'projects_file', 'social_file', 'blog_file', 'backup_path']:
            if key in data:
                config.set('PATHS', key, str(data[key]))
        
        # Update security settings
        for key in ['auto_backup', 'validate_json', 'log_changes', 'confirm_delete']:
            if key in data:
                config.set('SECURITY', key, str(data[key]).lower())
        
        # Save config
        with open('config.ini', 'w') as configfile:
            config.write(configfile)
        
        return jsonify({'success': True, 'message': 'Ayarlar başarıyla kaydedildi!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Hata: {str(e)}'})


@app.route('/api/git_command', methods=['POST'])
def git_command():
    try:
        data = request.get_json()
        command = data.get('command', '')
        command_type = data.get('type', '')
        
        if not command:
            return jsonify({'success': False, 'message': 'Komut belirtilmedi'})
        
        # Security check - only allow git commands
        if not command.startswith('git '):
            return jsonify({'success': False, 'message': 'Sadece git komutlarına izin verilir'})
        
        # Get the parent directory (where the git repo is)
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Execute git command
        import subprocess
        result = subprocess.run(
            command,
            shell=True,
            cwd=parent_dir,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            output = result.stdout.strip()
            if not output:
                output = "Komut başarıyla çalıştırıldı."
            
            # Success messages for different command types
            messages = {
                'status': 'Git durumu başarıyla alındı',
                'add': 'Dosyalar başarıyla eklendi',
                'commit': 'Değişiklikler başarıyla commit edildi',
                'push': 'Değişiklikler başarıyla GitHub\'a push edildi',
                'workflow': 'Workflow komutu başarıyla çalıştırıldı',
                'quick': 'Hızlı komut başarıyla çalıştırıldı'
            }
            
            message = messages.get(command_type, 'Komut başarıyla çalıştırıldı')
            
            return jsonify({
                'success': True,
                'output': output,
                'message': message
            })
        else:
            error_output = result.stderr.strip()
            if not error_output:
                error_output = "Bilinmeyen hata"
            
            return jsonify({
                'success': False,
                'error': error_output,
                'message': f'Komut başarısız: {error_output}'
            })
            
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Komut zaman aşımına uğradı (30 saniye)',
            'message': 'Komut çok uzun sürdü'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': f'Beklenmeyen hata: {str(e)}'
        })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
