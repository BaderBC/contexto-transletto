FROM rust

WORKDIR /app

COPY . .

RUN cargo build --release

EXPOSE 3000
CMD ["./target/release/back-end"]
