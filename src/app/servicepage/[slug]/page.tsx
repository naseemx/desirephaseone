import { notFound } from "next/navigation";
import { getServiceBySlug, getAllServices } from "@/data/service";
import { ServiceDetailView } from "@/components/servicepage/service-detail-view";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = getAllServices();
  return services.map((s) => ({
    slug: s.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return {
      title: "Service Not Found | Desire Advertising UAE",
    };
  }

  return {
    title: `${service.title} | Desire Digital UAE`,
    description: service.description
      ? service.description.slice(0, 160)
      : "Desire Advertising specialized digital display and fabrication solutions.",
    openGraph: {
      title: `${service.title} | Desire Digital UAE`,
      description: service.description?.slice(0, 160),
      images: service.image ? [{ url: service.image }] : undefined,
    },
  };
}

export default async function ServiceSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailView service={service} />;
}
