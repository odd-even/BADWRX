import { UploadIcon } from "@sanity/icons";
import { Box, Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { useCallback, useRef, useState } from "react";
import {
  PatchEvent,
  insert,
  set,
  useClient,
  type InputProps,
} from "sanity";
import {
  FIELD_GALLERY_ALT,
  FIELD_GALLERY_MAX_COUNT,
} from "../../src/data/field-gallery";
import {
  fileToGalleryWebpBlob,
  galleryWebpFilename,
} from "../lib/gallery-webp";

type GalleryImageValue = {
  _type: "image";
  _key: string;
  asset: { _type: "reference"; _ref: string };
  alt?: string;
};

function randomKey(): string {
  return Math.random().toString(36).slice(2, 11);
}

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|heic)$/i.test(file.name);
}

export function FieldGalleryInput(props: InputProps) {
  const { onChange, value, renderDefault, readOnly } = props;
  const sanityClient = useClient({ apiVersion: "2024-01-01" });

  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const current = (Array.isArray(value) ? value : []) as GalleryImageValue[];
  const remaining = Math.max(0, FIELD_GALLERY_MAX_COUNT - current.length);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (readOnly || uploading) return;

      const candidates = Array.from(files).filter(isImageFile);
      if (!candidates.length) {
        setError("Choose one or more image files (JPEG, PNG, or WebP).");
        return;
      }

      const batch = candidates.slice(0, remaining);
      if (!batch.length) {
        setError(`Gallery is full — maximum ${FIELD_GALLERY_MAX_COUNT} photos.`);
        return;
      }

      setUploading(true);
      setError(null);
      setStatus(`Converting and uploading 0 / ${batch.length}…`);

      const uploaded: GalleryImageValue[] = [];

      try {
        for (let index = 0; index < batch.length; index += 1) {
          const file = batch[index];
          setStatus(`Converting and uploading ${index + 1} / ${batch.length}…`);

          const webpBlob = await fileToGalleryWebpBlob(file);
          const asset = await sanityClient.assets.upload("image", webpBlob, {
            filename: galleryWebpFilename(file.name),
            contentType: "image/webp",
          });

          uploaded.push({
            _type: "image",
            _key: randomKey(),
            asset: { _type: "reference", _ref: asset._id },
            alt: FIELD_GALLERY_ALT,
          });
        }

        if (current.length === 0) {
          onChange(PatchEvent.from(set(uploaded)));
        } else {
          onChange(PatchEvent.from(insert(uploaded, "after", [-1])));
        }

        setStatus(
          uploaded.length === 1
            ? "Uploaded 1 photo as WebP."
            : `Uploaded ${uploaded.length} photos as WebP.`,
        );
      } catch (uploadError) {
        const message =
          uploadError instanceof Error
            ? uploadError.message
            : "Upload failed. Try again.";
        setError(message);
        setStatus(null);
      } finally {
        setUploading(false);
      }
    },
    [current.length, onChange, readOnly, remaining, sanityClient, uploading],
  );

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files?.length) void uploadFiles(files);
    event.target.value = "";
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (readOnly || uploading) return;
    if (event.dataTransfer.files?.length) void uploadFiles(event.dataTransfer.files);
  };

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} shadow={1} tone="transparent" border>
        <Stack space={4}>
          <Stack space={2}>
            <Text size={1} weight="semibold">
              Bulk upload
            </Text>
            <Text size={1} muted>
              Drop photos here or choose files. Each image is resized to 1920px wide,
              converted to WebP, and added to the masonry gallery. Up to{" "}
              {FIELD_GALLERY_MAX_COUNT} photos total ({remaining} remaining).
            </Text>
          </Stack>

          <Flex
            align="center"
            justify="center"
            padding={5}
            onDragOver={(event) => event.preventDefault()}
            onDrop={onDrop}
            style={{
              border: "1px dashed var(--card-border-color)",
              borderRadius: "4px",
              cursor: readOnly || uploading ? "default" : "pointer",
              opacity: readOnly ? 0.6 : 1,
            }}
            onClick={() => {
              if (!readOnly && !uploading) inputRef.current?.click();
            }}
          >
            <Stack space={3} style={{ textAlign: "center" }}>
              {uploading ? <Spinner muted /> : <UploadIcon />}
              <Text size={1}>
                {uploading ? "Processing…" : "Drop images or click to browse"}
              </Text>
              <Text size={0} muted>
                JPEG, PNG, WebP, HEIC — multiple files supported
              </Text>
            </Stack>
          </Flex>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={readOnly || uploading || remaining === 0}
            onChange={onInputChange}
          />

          {!readOnly && remaining > 0 ? (
            <Box>
              <Button
                icon={UploadIcon}
                text="Choose images"
                mode="ghost"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              />
            </Box>
          ) : null}

          {status ? (
            <Text size={1} style={{ color: "var(--card-positive-fg-color)" }}>
              {status}
            </Text>
          ) : null}
          {error ? (
            <Text size={1} style={{ color: "var(--card-critical-fg-color)" }}>
              {error}
            </Text>
          ) : null}
        </Stack>
      </Card>

      {renderDefault(props)}
    </Stack>
  );
}
