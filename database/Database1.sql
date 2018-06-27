create schema bhonl;
CREATE TABLE GIANHANG(
	IdGH int(3) unsigned  zerofill not null auto_increment,
	TenGian NVARCHAR(20) NOT NULL, 
	MoTa NVARCHAR(50),
	PRIMARY KEY (IdGH)
);

CREATE TABLE LOAIHANG
(
	IdLH int(3)  zerofill not null auto_increment,
    IdGH int(3),
	TenLoai NVARCHAR(20) not null,
	MoTa NVARCHAR(50),
	PRIMARY KEY(IDLH)
);
CREATE TABLE MATHANG(
	IDMATHANG int(3)   zerofill not null auto_increment,
	TenMH NVARCHAR(40) NOT NULL,
	IdGH int(3) NOT NULL,
	IdLH int (3) NOT NULL,
	URLHinhAnh1 VARCHAR(100),
	URLHinhAnh2 VARCHAR(100),
	URLHinhAnh3 VARCHAR(100),
	MoTa NVARCHAR(100),
	GiaMoi INT,
	GiaCu INT,
	PRIMARY KEY(IDMATHANG)
	
);
CREATE TABLE BINHLUAN(
IDBINHLUAN int(3)   zerofill not null auto_increment,
Ten NVARCHAR(20) ,
IDTAIKHOAN VARCHAR(20),
NOIDUNG NVARCHAR(500),
PRIMARY KEY (IDBINHLUAN)

);


CREATE TABLE CHITIETMATHANG(
	IDCTMH int(3)   zerofill not null auto_increment,
	IDMatHang int(3) NOT NULL,
	Size VARCHAR(3),
	Gia INT,
	SoLuong INT,
	PRIMARY KEY (IDCTMH)
);

CREATE TABLE TAIHOAN(
	Username VARCHAR(20) NOT NULL,
	Password VARCHAR(20) NOT NULL, 
    Admin Bit NOT NULL,
	PRIMARY KEY (Username)
);
CREATE TABLE KHACHHANG(
	IDKHACHHANG int(3)   zerofill not null auto_increment,
	Ten NVARCHAR(20) NOT NULL,
	Email VARCHAR(30), 
	SDT INT NOT NULL,
	DiaChi NVARCHAR(50),
	IDAccount VARCHAR(20),
	PRIMARY KEY (IDKHACHHANG)
);
CREATE TABLE HOADON(
	
	IDHOADON  int(3)   zerofill not null auto_increment,
	IDKhachHang int(3) NOT NULL,
	Ngay DATE NOT NULL,
	TongTien INT NOT NULL,
	TinhTrang NVARCHAR(20) NOT NULL,
	PRIMARY KEY (IDHOADON)
	
);
CREATE TABLE CHITIETHOADON(
	IDCTHD int(3)   zerofill not null auto_increment,
	IDChiTietMatHang int(3) NOT NULL,
	IDHoaDon int(3) NOT NULL,
	SoLuong INT,
	PRIMARY KEY (IDCTHD)
);