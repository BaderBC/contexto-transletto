FROM rust

WORKDIR /app

ARG DEV_MODE

RUN if [ "$DEV_MODE" = "true" ]; then \
    cargo install cargo-watch; \
fi

COPY . .

RUN cargo build --release

EXPOSE 3000
CMD ["./target/release/back-end"]
