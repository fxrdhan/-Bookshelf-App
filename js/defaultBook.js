// Ensure defaultBooks is attached to the window object for global access
const defaultBooks = [
    {
        id: "1",
        title: "Bumi",
        author: "Tere Liye",
        year: 2014,
        isComplete: false,
        isFavorite: false,
        cover: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/cover/bumi.jpg"
    },
    {
        id: "2",
        title: "Moon",
        author: "Tere Liye",
        year: 2019,
        isComplete: false,
        isFavorite: false,
        cover: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/cover/moon.jpg"
    },
    {
        id: "3",
        title: "Matahari",
        author: "Tere Liye",
        year: 2016,
        isComplete: false,
        isFavorite: false,
        cover: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/cover/matahari.jpg"
    },
    {
        id: "4",
        title: "Nebula",
        author: "Tere Liye",
        year: 2021,
        isComplete: false,
        isFavorite: false,
        cover: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/cover/nebula.jpg"
    },
    {
        id: "5",
        title: "Bintang",
        author: "Tere Liye",
        year: 2014,
        isComplete: false,
        isFavorite: false,
        cover: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/cover/bintang.jpg"
    },
    {
        id: "6",
        title: "Ceros dan Batozar",
        author: "Tere Liye",
        year: 2019,
        isComplete: false,
        isFavorite: false,
        cover: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/cover/ceros-dan-batozar.jpg"
    },
    {
        id: "7",
        title: "Mirai",
        author: "Mamoru Hosoda",
        year: 2000,
        isComplete: false,
        isFavorite: true,
        cover: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/cover/mirai.jpg",
        pdfUrl: "https://raw.githubusercontent.com/fxrdhan/Bookshelf-App/main/default-books/pdf/mirai.pdf"
    },
];

if (typeof window !== 'undefined') {
    window.defaultBooks = defaultBooks;
}
