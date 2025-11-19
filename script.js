
class MusicPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audio-player');
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.trackTitle = document.getElementById('track-title');
        this.trackArtist = document.getElementById('track-artist');
        this.albumArt = document.getElementById('album-art');
        this.songList = document.getElementById('song-list');

        this.currentTrackIndex = 0;
        this.isPlaying = false;

        // 示例音乐库 - 实际使用时替换为您的MP3文件路径
        this.playlist = [
            {
                title: "示例歌曲1",
                artist: "示例艺术家",
                src: "music/song1.mp3",
                // src: "http://t5ye9m18x.hn-bkt.clouddn.com/music1/music/song1.mp3",
                cover: "https://picsum.photos/200/200?random=1"
            },
            {
                title: "示例歌曲2",
                artist: "示例艺术家",
                src: "music/song2.mp3",
                cover: "https://picsum.photos/200/200?random=2"
            },
            {
                title: "示例歌曲3",
                artist: "示例艺术家",
                src: "music/song3.mp3",
                cover: "https://picsum.photos/200/200?random=3"
            }
        ];

        this.init();
    }

    init() {
        this.renderPlaylist();
        this.setupEventListeners();
        this.loadTrack(0);
    }

    renderPlaylist() {
        this.songList.innerHTML = '';
        this.playlist.forEach((track, index) => {
            const li = document.createElement('li');
            li.className = 'song-item';
            if (index === this.currentTrackIndex) {
                li.classList.add('active');
            }
            li.innerHTML = `
                <strong>${track.title}</strong>
                <span style="float: right; opacity: 0.7;">${track.artist}</span>
            `;
            li.addEventListener('click', () => this.loadTrack(index));
            this.songList.appendChild(li);
        });
    }

    setupEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.previousTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.volumeSlider.addEventListener('input', () => this.adjustVolume());

        this.audioPlayer.addEventListener('ended', () => this.nextTrack());
        this.audioPlayer.addEventListener('loadedmetadata', () => this.updateTrackInfo());
    }

    loadTrack(index) {
        this.currentTrackIndex = index;
        const track = this.playlist[index];

        this.audioPlayer.src = track.src;
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        this.albumArt.src = track.cover;
        this.albumArt.alt = `${track.title} - 专辑封面`;

        this.renderPlaylist();

        if (this.isPlaying) {
            this.audioPlayer.play().catch(e => console.log('播放错误:', e));
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audioPlayer.pause();
            this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            this.audioPlayer.play().then(() => {
                this.isPlaying = true;
                this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(e => {
                console.log('播放失败:', e);
            });
        }
        this.isPlaying = !this.isPlaying;
    }

    previousTrack() {
        this.currentTrackIndex = this.currentTrackIndex > 0 ? this.currentTrackIndex - 1 : this.playlist.length - 1;
        this.loadTrack(this.currentTrackIndex);
    }

    nextTrack() {
        this.currentTrackIndex = this.currentTrackIndex < this.playlist.length - 1 ? this.currentTrackIndex + 1 : 0;
        this.loadTrack(this.currentTrackIndex);
    }

    adjustVolume() {
        const volume = this.volumeSlider.value / 100;
        this.audioPlayer.volume = volume;

        // 更新音量图标
        if (volume === 0) {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (volume < 0.5) {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    updateTrackInfo() {
        const track = this.playlist[this.currentTrackIndex];
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
    }

    // 添加歌曲到播放列表
    addTrack(title, artist, src, cover) {
        this.playlist.push({ title, artist, src, cover });
        this.renderPlaylist();
    }

    // 从播放列表移除歌曲
    removeTrack(index) {
        this.playlist.splice(index, 1);
        if (this.currentTrackIndex >= index && this.currentTrackIndex > 0) {
            this.currentTrackIndex--;
        }
        this.renderPlaylist();
    }
}

// 页面加载完成后初始化播放器
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});

// 键盘快捷键支持
document.addEventListener('keydown', (e) => {
    const player = window.musicPlayer;
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            player.togglePlay();
            break;
        case 'ArrowLeft':
            player.previousTrack();
            break;
        case 'ArrowRight':
            player.nextTrack();
            break;
    }
});
