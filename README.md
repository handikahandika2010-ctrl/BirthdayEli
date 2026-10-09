# 🍓 A Little Berry Birthday for You

Static birthday website using only:
- HTML5
- CSS3
- Vanilla JavaScript

## Folder structure

```text
berry-birthday/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── images/
    │   ├── memory-1.jpg
    │   ├── memory-2.jpg
    │   ├── memory-3.jpg
    │   ├── memory-4.jpg
    │   ├── memory-5.jpg
    │   └── memory-6.jpg
    ├── music/
    │   └── birthday-song.mp3
    └── fonts/
```

The project intentionally does not require image files for the berry characters: the main berry characters are CSS illustrations, so the page works immediately even before you add your own photos/music.

## Customize

Open `script.js` and edit the `CONFIG` object at the top:

```js
const CONFIG = {
  birthdayPerson: "NAME",
  letter: `YOUR LETTER HERE`,
  songTitle: "birthday-song.mp3",
  songArtist: "a little soundtrack for today ♡",
  compliments: [...]
};
```

### Photos
Put your images in:

```text
assets/images/
```

Use these names:
- `memory-1.jpg`
- `memory-2.jpg`
- `memory-3.jpg`
- `memory-4.jpg`
- `memory-5.jpg`
- `memory-6.jpg`

You can also use `.png` or `.webp`, but then change the matching `src` in `index.html`.

### Music
Put your permitted audio file at:

```text
assets/music/birthday-song.mp3
```

The music starts after clicking **Open it**, because modern browsers often block autoplay before a user interaction.

## Run locally

Double-click `index.html`, or open it in a browser.

For the simplest local test, you can also use VS Code + Live Server, but it is not required.

## GitHub Pages

1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `script.js`, and the `assets` folder.
3. Open the repository's **Settings**.
4. Open **Pages**.
5. Under the source/build option, select the branch containing the files (usually `main`) and the `/ (root)` folder.
6. Save.
7. GitHub will provide the Pages URL after the deployment finishes.

All asset references use relative paths such as:

```text
./assets/images/memory-1.jpg
./assets/music/birthday-song.mp3
```

so the project is compatible with GitHub Pages.

---
## Catatan v3
- Surat: edit isi di `CONFIG.letter` (baris kosong = paragraf baru, baris terakhir yang diawali "—" jadi tanda tangan), sapaan di `CONFIG.letterGreeting`.
- Kata rahasia "berry" bisa diketik di keyboard (desktop) atau lewat kolom "secret word" di bagian akhir (HP). Kata lain ditambah di `SECRET_WORDS` dalam `script.js`.
